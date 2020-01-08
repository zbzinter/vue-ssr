<template>
  <div
    v-if="photos && photos.length"
    class="photos"
  >
    <ul class="clearfix">
      <li
        v-for="item in photos"
        :key="item.id"
        @click="goDetail(item)"
      >
        <div class="photos-img">
          <p>
            <background-img
              class="img"
              :src="item.imageAddress"
            />
          </p>
          <span class="iconaf_di" />
        </div>
        <div class="photos-text">
          <p class="photo-name">
            {{ item.nickName }}
          </p>
          <div class="photo-detail">
            <p>{{ item.tagName }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import BackgroundImg from '@src/components/BackgroundImg'
export default {
  components: {
    BackgroundImg
  },
  props: ['photos'],
  methods: {
    goDetail (item) {
      let href = window.location.origin + '/live/detail?id=0&roomId=' + item.linkId 
      window.open(href)
    }
  }
}
</script>

<style lang="postcss" scoped>
.photos {
  overflow: hidden;
  margin: 10px 0 0 0;
  padding: 15px;
  background: #ffffff;
  border-radius: 4px;
  ul {
    li {
      float: left;
      width: 166px;
      overflow: hidden;
      cursor: pointer;
      margin-right: 34px;
      .photos-img {
        float: left;
        margin-right: 11px;
        position: relative;
        span {
          font-family: 'iconfont';
          position: absolute;
          z-index: 6;
          right: -4px;
          bottom: -4px;
          font-size: 60px;
          &.iconaf_di {
            font-size: 14px;
            color: #cf4c45;
          }
          &.iconag_dh {
            font-size: 14px;
            color: #ebbc1b;
          }
        }
        .img {
          width: 50px;
          height: 50px;
          overflow: hidden;
          border-radius: 50%;
        }
      }
      .photos-text {
        font-size: 12px;
        color: #999999;
        line-height: 1.4em;
        .photo-name {
          font-size: 14px;
          line-height: 20px;
          color: #333333;
          margin: 4px 0 1px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .photo-detail {
          overflow: hidden;
        }
      }
    }
    li:last-child {
      margin-right: 0;
    }
  }
}
</style>
