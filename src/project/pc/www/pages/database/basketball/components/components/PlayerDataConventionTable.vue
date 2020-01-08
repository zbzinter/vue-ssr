<template>
  <div v-if="data.length">
    <table class="table">
      <thead>
        <tr>
          <th>总计</th>
          <th>场次</th>
          <th>加时场次</th>
          <th>时间</th>
          <th>得分</th>
          <th>进攻篮板</th>
          <th>防守篮板</th>
          <th>总篮板</th>
          <th>助攻</th>
          <th>封盖</th>
          <th>抢断</th>
          <th>失误</th>
          <th>犯规</th>
          <th>助失比</th>
        </tr>
        <tr>
          <td>{{ team.matchNum }}</td>
          <td>-</td>
          <td>-</td>
          <td>{{ team.score }}</td>
          <td>{{ team.attackReboud }}</td>
          <td>{{ team.defendRebound }}</td>
          <td>{{ team.totalRebound }}</td>
          <td>{{ team.assist }}</td>
          <td>{{ team.block }}</td>
          <td>{{ team.steal }}</td>
          <td>{{ team.mistake }}</td>
          <td>{{ team.foul }}</td>
          <td>{{ team.assitMistakeRate }}</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>球员</th>
          <th>场次</th>
          <th>首发</th>
          <th>时间</th>
          <th>得分</th>
          <th>进攻篮板</th>
          <th>防守篮板</th>
          <th>总篮板</th>
          <th>助攻</th>
          <th>封盖</th>
          <th>抢断</th>
          <th>失误</th>
          <th>犯规</th>
          <th>助失比</th>
        </tr>
        <tr
          v-for="(item, key) in data"
          :key="key"
        >
          <td>
            <div>
              <img
                :src="item.playerLogo"
                alt=""
              >
              <span>
                {{ item.playerName }}
              </span>
            </div>
          </td>
          <td>{{ item.matchNum }}</td>
          <td>{{ item.startingNum }}</td>
          <td>{{ item.playTime }}</td>
          <td>{{ item.score }}</td>
          <td>{{ item.attackReboud }}</td>
          <td>{{ item.defendRebound }}</td>
          <td>{{ item.totalRebound }}</td>
          <td>{{ item.assist }}</td>
          <td>{{ item.block }}</td>
          <td>{{ item.steal }}</td>
          <td>{{ item.mistake }}</td>
          <td>{{ item.foul }}</td>
          <td>{{ item.assitMistakeRate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      default: () => [],
      type: Array,
    },
    team: {
      default: () => {},
      type: Object,
    }
  }
}
</script>

<style lang="scss" scoped>

@import "./../../style/index.scss";

th {
  width: 60px;
}
td {
  width: 60px;
}
</style>
