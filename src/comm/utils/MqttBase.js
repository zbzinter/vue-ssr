/* eslint-disable */
import mqtt from 'mqtt'
import getMqttToken from '@business/mqttInfo'
import { getServerConf } from '@config/apiConf'
let setTimeoutMsg = null
let tempMsgArr = []
let { apiInfo } = getServerConf()
let ucimUrl = apiInfo.ucimUrl

/* let ucimServiceConnMgr = new ucim.UcimConnectionManager();
let ucimLoginManager = new ucim.AuthService();
let ucimMessageAdapter = new ucim.MessageAdapter();
let ucimChatRoomService = new ucim.ChatRoomService();
let ucimExternalMessageService = new ucim.ExternalMessageService() */
let ucimServiceConnMgr
let ucimLoginManager
let ucimMessageAdapter
let ucimChatRoomService
let ucimExternalMessageService
let ucimFlag = true

let onMessageMap = new Map();

let roomId = "";
let enterRoom = ""

let access_token = "";
let serverInfo;
let memberInRoomInfo;
let loginStatus = false;
let userInfo;
let isLiveCreator = false;
// 只接收一次历史消息，避免重复
let isHis = false

let toDoSubsTopics = {}
let toDoEnterRoomId = ""
let TempMuteStartTime = 0

// 当前房间id
let liveRoomId;

let IM_CONSTANT = {
  MsgTypeEnum_notification: 5, //通知消息
  NotificationType_ChatRoomMemberIn: 301,
  NotificationType_ChatRoomMemberExit: 302,
  NotificationType_ChatRoomMemberBlackAdd: 303,
  NotificationType_ChatRoomMemberBlackRemove: 304,
  NotificationType_ChatRoomMemberMuteAdd: 305,
  NotificationType_ChatRoomMemberMuteRemove: 306,
  NotificationType_ChatRoomManagerAdd: 307,
  NotificationType_ChatRoomManagerRemove: 308,
  NotificationType_ChatRoomCommonAdd: 309,
  NotificationType_ChatRoomCommonRemove: 310,
  NotificationType_ChatRoomClose: 311,
  NotificationType_ChatRoomInfoUpdated: 312,
  NotificationType_ChatRoomMemberKicked: 313,
  NotificationType_ChatRoomMemberTempMuteAdd: 314,
  NotificationType_ChatRoomMemberTempMuteRemove: 315,
  NotificationType_ChatRoomMyRoomRoleUpdated: 316,
  NotificationType_ChatRoomQueueChange: 317,
  NotificationType_ChatRoomRoomMuted: 318,
  NotificationType_ChatRoomRoomDeMuted: 319,
  NotificationType_ChatRoomMemberGlobalMuted: 320,
  NotificationType_ChatRoomMemberGlobalDeMuted: 321,
  MsgTypeEnum_custom: 100, //自定义消息

  MemberType_GUEST: -2 ,//游客
  MemberType_LIMITED: -1,
  MemberType_NORMAL: 0,//普通用户
  MemberType_CREATOR: 1,
  MemberType_ADMIN: 2,
}

export default class Mqtt {

  /**
   * 初始化
   * @param {*} getMessage 获取推送信息事件
   */
  constructor(getMessage, token) {
    this.initMqtt()
    // const wsType = location.href.startsWith('https') ? 'wss' : 'ws'
    // this.mqttUrl = `${wsType}:${mqttCom}`
    this.mqttClient = null
    this.subscribeList = []
    this.getMessage = getMessage;
    this.token = token
    this.muteList = []
    userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    if (userInfo === null || JSON.stringify(userInfo) == "{}") {
      let uuid = this.uuid()
      userInfo = {
        'uid': uuid,
        'isGuest': true,
        'nickName': '访客' + uuid.substring(0, 6)
      }
    } else {
      userInfo.isGuest = false;
    }
  }

  initMqtt() {
    if (!ucimFlag) return
    ucimServiceConnMgr = new ucim.UcimConnectionManager();
    ucimLoginManager = new ucim.AuthService();
    ucimMessageAdapter = new ucim.MessageAdapter();
    ucimChatRoomService = new ucim.ChatRoomService();
    ucimExternalMessageService = new ucim.ExternalMessageService()
    ucimFlag = false
  }

  // 獲取token（異步）
  getMqttToken() {
    return getMqttToken()
  }

  /**
   * 取消订阅某个或所有事件
   * @param {undefined|String|Array} topics 默认取消所有订阅 
   */
  unsubscribe(topics) {

    let { subscribeList } = this
    let unsubscribeList = typeof topics === 'undefined' ? [...subscribeList] : topics;
    ucimExternalMessageService.unpsubscribeMsg(unsubscribeList);
    unsubscribeList = Array.isArray(unsubscribeList) ? [...unsubscribeList] : [unsubscribeList]
    this.subscribeList = subscribeList.filter(item => unsubscribeList.some(val => val === item))
    console.log(topics + ': 取消订阅')
  }

  // 订阅事件触发
  onMessage(topic, mqttMsg) {
    if (typeof this.getMessage === 'function') {
      this.getMessage(topic, mqttMsg)
    }
  }

  // 初始化
  start() {
    var _this = this;
    return new Promise((resolve, reject) => {
      if (typeof serverInfo == "undefined") {
        if (userInfo.isGuest) {
          serverInfo = ucimServiceConnMgr.getServerInfo(ucimUrl + "/token", "guest", userInfo.uid + '')
        } else {
          serverInfo = ucimServiceConnMgr.getVerifyInfo(ucimUrl + "/verify", window.localStorage.getItem('token'))
        }
        if (typeof serverInfo == "undefined") reject("获取服务信息失败");

        let access_ws = window.location.protocol === 'https:' ? "wss://" : "ws://"
        //let access_ws = "ws://"
        if (typeof serverInfo.access_url != "undefined") {
          let json = JSON.parse(serverInfo.access_url);
          let linkServer = json.common.link[0];
          let arrInfo = linkServer.split(":")
          access_ws += `${window.location.protocol === 'http:' ? `${arrInfo[0]}:${json.common.wsport}` : linkServer}/connection/websocket`;
          access_token = serverInfo.access_token;
          // access_token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjA4Njc3MTksInVzZXJfbmFtZSI6IntcInVpZFwiOlwiMjA2MDQ3MTExOTc3Nzc5MlwiLFwidXNlckxldmVsXCI6MCxcInRpY2tldFwiOlwiXCIsXCJuaWNrTmFtZVwiOlwi5bCP54uQ54u4NzA1MjcxXCIsXCJtb2JpbGVcIjpcIjEzMjcwMTExODIxXCJ9IiwianRpIjoiM2RiZGIzMGQtYjk4ZS00ZGRjLTk1Y2QtMjhhYjJiMDEzNmFmIiwiY2xpZW50X2lkIjoiYXBwIiwic2NvcGUiOlsiYXBwIl19.Kl1w0iru3nIRvQ56hmVdqRBbjqB4FmrdD0co0TOe2aSaXov5Yz8gM4TvqcFZK2PUZiBt2W-qBekULLu1OLQ-cR36eQuoumE7CPWfySkVcq4G2BkFB_Y9reU6oJOuiyH5KBMXhxQM3Z9T15fnqn2tu-iy9MeLJWwYO-dipDcPSAgrCg7qZIxG3ojEwW6HVG1oqdzaiwU1lk2mjW9qlPPQ9cEmiXEmz_Dqa8b4oSCIBI8p5Kwrekk-e10mmapeiIm9oHw4qDeuqstkSWOv2TN3vUe9EqoRpcP7FDA1S9bjpJE8XbjxlwubO5w1OF-nREfCziFGFrNbjv8jW1YVqTm4ig';
        } else {
          reject("获取token失败");
        }
        //测试websocket连接和bytebuffer解析
        console.log("access_ws is " + access_ws)
        ucimServiceConnMgr.startConnect({
          // url: 'wss://mqtt-cn-mp90zryi40c.mqtt.aliyuncs.com/',
          url: access_ws,
          data: "",
          onmessage: function (event) {
            if (typeof event.data == 'object') {
              let reader = new FileReader();
              let arrayBuffer = new ArrayBuffer();
              reader.onload = function () {
                arrayBuffer = this.result;
                ucimMessageAdapter.onProcess(arrayBuffer, {
                  onLogin: function (resCode) {
                    console.log("onLogin ", resCode)
                    loginStatus = true;
                    if (resCode == 200) {
                      console.log("登录成功")
                      resolve("success");
                      if (toDoEnterRoomId != "") {
                        let userType = IM_CONSTANT.MemberType_GUEST
                        if (!userInfo.isGuest) {
                            if (isLiveCreator) {
                              userType = IM_CONSTANT.MemberType_CREATOR
                            } else {
                              userType = IM_CONSTANT.MemberType_NORMAL
                            }
                        }
                        ucimChatRoomService.backstageEnterRoom(userInfo.uid + '', userInfo.nickName, userType, toDoEnterRoomId);
                        toDoEnterRoomId = ""
                      }
                      ucimExternalMessageService.subscribeMsg(Object.keys(toDoSubsTopics));
                      toDoSubsTopics = {}
                    } else {
                      reject("登录失败")
                    }
                  },
                  onChatMsg: function (msgObj) {
                    var content = JSON.parse(msgObj.getContent())
                    var type = content.type
                    var onMsgRecv = onMessageMap.get(type)
                    if (typeof onMsgRecv === 'function') {
                      onMsgRecv(type, JSON.parse(msgObj.getContent()));
                    }
                  },
                  onChatRoomMsg: function (roomMsg) {
                    let msgContent = ''
                    if (roomMsg.getMsgtype() == IM_CONSTANT.MsgTypeEnum_notification) {
                      var jsonObj = JSON.parse(roomMsg.getAttachmentJson())
                      let idMap = {
                        301: 5,
                        undefined: 0
                      }
                      let baseObj = {
                        nickName: jsonObj.data.opeNick,
                        userId: jsonObj.data.operator,
                        msgType: idMap[jsonObj.id]
                      }
                      if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomMemberIn) {
                        if (!baseObj.nickName) return
                        baseObj.content = `系统消息：欢迎${baseObj.nickName}进入直播间`
                        jsonObj.data.ext ? baseObj.guest = jsonObj.data.ext.guest : ''
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomMemberExit) {
                        baseObj.content = jsonObj.data.opeNick + " 离开房间"
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomMemberMuteAdd) {
                        baseObj.msgType = 5
                        baseObj.content = '系统消息：'+jsonObj.data.tarNick[0]+'已被禁言'
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomMemberMuteRemove) {
                        baseObj.content = "管理员" + jsonObj.data.opeNick + "把" + jsonObj.data.tarNick[0] + "的禁言解除了"
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomMemberTempMuteAdd) {
                        if (jsonObj.data.target == userInfo.uid) {
                          TempMuteStartTime = new Date().getTime()/1000
                          memberInRoomInfo.setTempMuteDuration(jsonObj.data.muteDuration);
                        }
                        baseObj.msgType = 5
                        baseObj.content = '系统消息：'+jsonObj.data.tarNick[0]+'已被禁言'
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomMemberTempMuteRemove) {
                        if (jsonObj.data.target == userInfo.uid) {
                          TempMuteStartTime = 0
                          memberInRoomInfo.setTempMuteDuration(0);
                        }
                        baseObj.content = "管理员" + jsonObj.data.opeNick + "把" + jsonObj.data.tarNick[0] + "的临时禁言取消了"
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomManagerAdd) {
                        _this.saveManager(liveRoomId, jsonObj.data.target[0])
                        baseObj.msgType = 5
                        baseObj.content = '系统消息：'+jsonObj.data.tarNick[0]+'为直播间管理员'
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomManagerRemove) {
                        baseObj.msgType = 5
                        baseObj.content = '系统消息：'+jsonObj.data.tarNick[0]+'被撤销管理员'
                        _this.saveManager(liveRoomId, jsonObj.data.target[0], true)
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomMemberKicked) {
                        baseObj.content = jsonObj.data.tarNick[0] + "被踢出了房间"
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomMemberGlobalMuted) {
                        
                        baseObj.msgType = 5
                        baseObj.content = '系统消息：'+jsonObj.data.tarNick[0]+'被全局禁言'
                        memberInRoomInfo.setIsMuted(true);
                      } else if (jsonObj.id == IM_CONSTANT.NotificationType_ChatRoomMemberGlobalDeMuted) {
                        baseObj.content = jsonObj.data.tarNick[0] + "被取消全局禁言"
                        memberInRoomInfo.setIsMuted(false);
                      }
                      msgContent = JSON.stringify(baseObj)
                    } else if (roomMsg.getMsgtype() == IM_CONSTANT.MsgTypeEnum_custom) {//执行自定义消息
                      msgContent = roomMsg.getAttachmentJson()
                    } else {
                      msgContent = roomMsg.getAttachmentJson()
                    }
                    let onMsgRecv = onMessageMap.get(roomMsg.getSessionId())
                    if (typeof onMsgRecv === 'function') {
                      onMsgRecv(roomMsg.getSessionId(), eval('(' + msgContent + ')'));
                    }
                  },
                  onSubMsg: function (msgObj) {
                    let onMsgRecv = onMessageMap.get(msgObj.getChannel())
                    let topic = msgObj.getChannel().split('/')
                    if (typeof onMsgRecv !== 'function') {
                      for (const [key, value] of onMessageMap) {
                        if (key.indexOf("*") !== -1) {
                          let topicList = key.split("/");
                          let status = true;
                          for (let i = 0; i < topicList.length; i++) {
                            if (topicList[i] != "*") {
                              if (topicList[i] != topic[i]) {
                                status = false;
                                break;
                              }
                            }
                          }
                          if (status) {
                            onMsgRecv = onMessageMap.get(key)
                          }
                        }
                      }
                    }
                    // 防抖和去重
                    if (typeof onMsgRecv === 'function') {
                      let topicCollects = tempMsgArr.map(item => item.topic)
                      let topicIndex = topicCollects.findIndex((item) => item === msgObj.getChannel())
                      if (topicIndex !== -1) {
                        tempMsgArr.splice(topicIndex, 1, {
                          topic: msgObj.getChannel(),
                          content: JSON.parse(msgObj.getContent())
                        })
                      } else {
                        tempMsgArr.push({
                          topic: msgObj.getChannel(),
                          content: JSON.parse(msgObj.getContent())
                        })
                      }
                      if (setTimeoutMsg) window.clearTimeout(setTimeoutMsg)
                      setTimeoutMsg = window.setTimeout(() => {
                        tempMsgArr.forEach((item) => {
                          onMsgRecv(item.topic, item.content);
                        })
                        window.clearTimeout(setTimeoutMsg)
                        tempMsgArr = []
                      }, 1000)
                    }
                  },
                  onEnterRoom: function (roomInfo, memberInfo) {
                    memberInRoomInfo = memberInfo;

                    if (typeof enterRoom === 'function') {
                      enterRoom()
                    }
                    if (memberInRoomInfo.getTempMuteDuration() > 0) {
                      TempMuteStartTime = new Date().getTime()/1000
                    } else {
                      TempMuteStartTime = 0
                    }
                    enterRoom = ''
                    roomId = "";
                    // 不加载历史记录
                    // ucimChatRoomService.roomPullMsgHistory(roomInfo.getRoomId(), 0);
                    let curRoomId = roomInfo.getRoomId()
                    liveRoomId = curRoomId.slice(5, curRoomId.length)
                    const uid = memberInfo.getAccount()
                    // 当前用户是否是房管
                    const isManage = memberInfo.getType() === 2 ? 1 : ''
                    const curUid = localStorage.getItem('uid')
                    // console.log("房间号是:" + roomInfo.getRoomId());
                    // console.log("当前人是：" + memberInfo.getAccount());
                    // console.log("是否房管：", memberInfo.getType() === 2);
                    // console.log('禁言时间：', memberInRoomInfo.getTempMuteDuration());
                    if(isManage) {
                      _this.saveManager(liveRoomId, uid)
                    }
                  },
                  onHistory: function (msgArray) {
                    if (!isHis && msgArray.length > 0) {
                      isHis = true
                      msgArray = msgArray.slice(-20)
                      msgArray.forEach(function (roomMsg) {
                        let msgContent = ''
                        if (roomMsg.getMsgtype() == IM_CONSTANT.MsgTypeEnum_notification) {
                          var jsonObj = JSON.parse(roomMsg.getAttachmentJson())
                          let idMap = {
                            301: 5,
                            undefined: 0
                          }
                          let baseObj = {
                            nickName: jsonObj.data.opeNick,
                            userId: jsonObj.data.operator,
                            msgType: idMap[jsonObj.id]
                          }
                          if (jsonObj.id == NotificationType_ChatRoomMemberIn) {
                            if (!baseObj.nickName) return
                            // baseObj.content = `【直播员】欢迎${baseObj.nickName}进入直播间，和大家打个招呼吧`
                            baseObj.content = `系统消息：欢迎${baseObj.nickName}进入直播间`
                            jsonObj.data.ext ? baseObj.guest = jsonObj.data.ext.guest : ''
                            // 会员等级
                            //jsonObj.data.ext.level
                            // 游客 bool
                            //jsonObj.data.ext.guest 
                          } else if (jsonObj.id == NotificationType_ChatRoomMemberExit) {
                            baseObj.content = jsonObj.data.opeNick + " 离开房间"
                          } else if (jsonObj.id == NotificationType_ChatRoomMemberMuteAdd) {
                            baseObj.content = jsonObj.data.opeNick + "把" + jsonObj.data.tarNick[0] + "禁言了"
                          } else if (jsonObj.id == NotificationType_ChatRoomMemberMuteAdd) {
                            baseObj.content = "管理员" + jsonObj.data.opeNick + "把" + jsonObj.data.tarNick[0] + "禁言了"
                          } else if (jsonObj.id == NotificationType_ChatRoomMemberMuteRemove) {
                            baseObj.content = "管理员" + jsonObj.data.opeNick + "把" + jsonObj.data.tarNick[0] + "的禁言解除了"
                          } else if (jsonObj.id == NotificationType_ChatRoomMemberTempMuteAdd) {
                            if (jsonObj.data.target == userInfo.uid) {
                              memberInRoomInfo.setTempMuteDuration(jsonObj.data.muteDuration);
                            }
                            baseObj.content = "管理员" + jsonObj.data.opeNick + "把" + jsonObj.data.tarNick[0] + "设置了" + jsonObj.data.muteDuration + "秒的禁言"
                          } else if (jsonObj.id == NotificationType_ChatRoomMemberTempMuteRemove) {
                            if (jsonObj.data.target == userInfo.uid) {
                              memberInRoomInfo.setTempMuteDuration(0);
                            }
                            baseObj.content = "管理员" + jsonObj.data.opeNick + "把" + jsonObj.data.tarNick[0] + "的临时禁言取消了"
                          } else if (jsonObj.id == NotificationType_ChatRoomManagerAdd) {
                            baseObj.content = jsonObj.data.tarNick[0] + "成为管理员"
                          } else if (jsonObj.id == NotificationType_ChatRoomManagerRemove) {
                            baseObj.content = jsonObj.data.tarNick[0] + "被取消管理员"
                          } else if (jsonObj.id == NotificationType_ChatRoomMemberKicked) {
                            baseObj.content = jsonObj.data.tarNick[0] + "被踢出了房间"
                          } else if (jsonObj.id == NotificationType_ChatRoomMemberGlobalMuted) {
                            baseObj.content = jsonObj.data.tarNick[0] + "被全局禁言"
                            memberInRoomInfo.setIsMuted(true);
                          } else if (jsonObj.id == NotificationType_ChatRoomMemberGlobalDeMuted) {
                            baseObj.content = jsonObj.data.tarNick[0] + "被取消全局禁言"
                            memberInRoomInfo.setIsMuted(false);
                          }
                          msgContent = JSON.stringify(baseObj)
                        } else if (roomMsg.getMsgtype() == IM_CONSTANT.MsgTypeEnum_custom) { //执行自定义消息
                          // 自定义消息-不加载历史消息
                          msgContent = '{"type":"-1"}'
                        } else {
                          msgContent = roomMsg.getAttachmentJson()
                        }
                        let onMsgRecv = onMessageMap.get(roomMsg.getSessionId())
                        if (typeof onMsgRecv === 'function') {
                          onMsgRecv(roomMsg.getSessionId(), eval('(' + msgContent + ')'));
                        }
                      })
                    }
                  }
                });
              };
              reader.readAsArrayBuffer(event.data);

            }

          },
          onopen: function (event) {
            ucimLoginManager.login(userInfo.uid + '', userInfo.isGuest, access_token);
          }
        });
      } else {
        resolve("inited");
      }
    })
  }

  /**
   * 订阅
   * @param {String|Array} topics 订阅地址類型（詳情請查看接口文檔）
   * @pattern {Boolean} 不是通用订阅需要传，不然收不到消息
   */
  subscribe(topics, callback, pattern) {
    let { subscribeList } = this
    topics = Array.isArray(topics) ? [...topics] : [topics]
    // 避免重复订阅
    topics = topics.filter(item => !(subscribeList.some(val => val === item)));
    let topics_str = topics.toString();
    console.log("topics:" + topics)
    if (topics_str.indexOf("match_") !== -1 || topics_str.indexOf("live_") !== -1) {
      roomId = topics_str
      onMessageMap.set(topics_str, this.getMessage)
      if (pattern == "livecreator") {
        isLiveCreator = true;
      }
      
      if (typeof callback === 'function') enterRoom = callback.bind(this)
      this.start().then((result) => {
        if (loginStatus) {
          let userType = IM_CONSTANT.MemberType_GUEST
                        if (!userInfo.isGuest) {
                            if (isLiveCreator) {
                              userType = IM_CONSTANT.MemberType_CREATOR
                            } else {
                              userType = IM_CONSTANT.MemberType_NORMAL
                            }
                        }
                        ucimChatRoomService.backstageEnterRoom(userInfo.uid + '', userInfo.nickName, userType, topics_str);
         // ucimChatRoomService.enterRoom(userInfo.uid + '', userInfo.nickName, topics_str);
        } else {
          toDoEnterRoomId = topics_str
        }
      })
    } else {
      if (Array.isArray(topics)) {
        topics.forEach(item => {
          onMessageMap.set(item, this.getMessage)
        })
      } else {
        onMessageMap.set(topics, this.getMessage)
      }
      if (topics.length > 0) {
        this.start().then((result) => {
          if (pattern == "p2p") {
            return;
          }

          console.log("开始订阅")
          if (!loginStatus) {
            if (Array.isArray(topics)) {
              topics.forEach(item => {
                toDoSubsTopics[item] = item
              })
            } else {
              toDoSubsTopics[topics] = topics
            }
          } else {
            if (pattern) {
              ucimExternalMessageService.subscribeMsg(topics);
            } else {
              ucimExternalMessageService.psubscribeMsg(topics);
            }
          }

          if (typeof callback === 'function') {
            callback()
          }
        }).catch(err => {
          console.log(err);
        })
      } else {
        this.subscribeSucc(topics)
      }
    }
  }

  // 订阅成功处理
  subscribeSucc(topics) {
    console.log(topics + ' :----订阅成功')
  }

  sendMessage(roomId, msg) {
    let _params = { code: 200, 'nickName': "【管理员】", 'content': '您已被禁言', 'msgType': 99 }
    if (memberInRoomInfo.getIsMuted()) {
      let onMsgRecv = onMessageMap.get(roomId)
      if (typeof onMsgRecv === 'function') {
        _params.content = '您已被禁言'
        onMsgRecv(roomId, _params);
        return _params;
      }
    }

    if (TempMuteStartTime > 0 && (memberInRoomInfo.getTempMuteDuration() + TempMuteStartTime) > new Date().getTime()/1000) {
      let onMsgRecv = onMessageMap.get(roomId)
      if (typeof onMsgRecv === 'function') {
        _params.content = '您已被临时禁言'
        onMsgRecv(roomId, _params);
        return _params;
      }
    }

    if (ucimChatRoomService.filterSensitiveWord(msg.content).flag) {
      console.log("发送信息中含有非法字符");
      let onMsgRecv = onMessageMap.get(roomId)
      if (typeof onMsgRecv === 'function') {
        _params.content = '您的消息中含有非法字符'
        onMsgRecv(roomId, _params);
        return _params;
      }
    }
    let res = { 'code': ucimChatRoomService.sendMessage(roomId, userInfo.nickName, msg) };
    if (res.code == 200) {
      res.msg = "发送成功";
      let msgInfo = {
        'recordId': this.uuid(),
        ...msg
      }
      let onMsgRecv = onMessageMap.get(roomId)
      if (typeof onMsgRecv === 'function') {
        onMsgRecv(roomId, msgInfo);
      }
    } else if (res.code == -1) {
      res.msg = "链接断开";
    } else if (res.code == -2) {
      res.msg = "当前账号异常";
    }
    return res;
  }

  uuid() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "";

    return s.join("");
  }

  // 存储管理员
  saveManager(roomId, uid, del) {
    // 标识是否是房管的key : 'roomUserType_' + '房间id' + "_" + '用户id'
    const _key = 'roomUserType_' + roomId + '_' + uid
    const curUid = localStorage.getItem('uid')
    // 判断是否是当前用户
    if(curUid != uid) return
    if(del) {
      sessionStorage.removeItem(_key)
    } else {
      sessionStorage.setItem(_key, 1)
    }
  }

}