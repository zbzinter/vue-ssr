<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>总计</th>
          <th>场次</th>
          <th>加时场次</th>
          <th>时间</th>
          <th>得分</th>
          <th>投篮命中</th>
          <th>投篮出手</th>
          <th>投篮命中率</th>
          <th>3分得分</th>
          <th>3分命中</th>
          <th>3分出手</th>
          <th>3分命中率</th>
          <th>罚球得分</th>
          <th>罚球出手</th>
          <th>罚球命中率</th>
        </tr>
        <tr>
          <td>2018-2019</td>
          <td>82</td>
          <td>-</td>
          <td>-</td>
          <td>105</td>
          <td>9.6</td>
          <td>35.6</td>
          <td>45.2</td>
          <td>25.5</td>
          <td>5.3</td>
          <td>8.3</td>
          <td>13.3</td>
          <td>21</td>
          <td>21</td>
          <td>21</td>
          <td>1.9</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>球员</th>
          <th>场次</th>
          <th>首发</th>
          <th>时间</th>
          <th>得分</th>
          <th>投篮命中</th>
          <th>投篮出手</th>
          <th>投篮命中率</th>
          <th>3分得分</th>
          <th>3分命中</th>
          <th>3分出手</th>
          <th>3分命中率</th>
          <th>罚球得分</th>
          <th>罚球出手</th>
          <th>罚球命中率</th>
        </tr>
        <tr>
          <td>
            <div>
              <img
                src=""
                alt=""
              >
              <span>OG-阿奴诺比</span>
            </div>
          </td>
          <td>
            21
          </td>
          <td>1</td>
          <td>4.9</td>
          <td>1.4</td>
          <td>9.9</td>
          <td>0.5</td>
          <td>3.5</td>
          <td>0</td>
          <td>05</td>
          <td>05</td>
          <td>05</td>
          <td>21</td>
          <td>21</td>
          <td>05</td>
          <td>05</td>
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
    }
  }
}
</script>

<style lang="scss" scoped>

th {
  width: 60px;
}
td {
  width: 60px;
}
</style>
