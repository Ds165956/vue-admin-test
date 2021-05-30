<!-- 粉丝管理页面 -->
<template>
  <div class="fans-contaiter">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="first">
          <el-row :gutter="20" style="margin-bottom: 20px">
            <el-col :span="3" v-for="(fans, index) in fansList" :key="index">
              <div class="fans_item">
                <el-image
                  style="width: 85px; height: 85px;border-radius: 50%;"
                  :src="fans.photo"
                  fit="cover"
                  lazy
                ></el-image>
                <p>{{ fans.name }}</p>
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  circle
                ></el-button>
                <!-- 暂时没有关注接口 -->
                <!-- <el-button
                  :type="fans.status ? 'success' : 'primary'"
                  :icon="fans.status ? 'el-icon-check' : 'el-icon-plus'"
                  circle
                ></el-button> -->
              </div>
            </el-col>
          </el-row>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            :page-size.sync="perpage"
            @current-change="fansPageChange"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second">
          <!-- <div id="myChart" :style="{ width: '300px', height: '300px' }"></div> -->
          暂无
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { uploadImages } from '@/api/fans'
export default {
  name: 'FansIndex',
  components: {},
  props: {},
  data () {
    return {
      activeName: 'first',
      page: 1,
      perpage: 20,
      totalCount: 0,
      fansList: []
    }
  },

  computed: {},

  created () {
    this.getFans()
    // this.drawLine()
  },

  mounted () {},

  methods: {
    getFans (page = 1) {
      uploadImages(page, this.perpage).then(res => {
        this.totalCount = res.data.data.total_count
        this.fansList = res.data.data.results
      })
    },
    fansPageChange () {
      this.getFans(this.page)
    }
    // drawLine () {
    //   // 基于准备好的dom，初始化echarts实例
    //   const myChart = this.$echarts.init(document.getElementById('myChart'))
    //   // 绘制图表
    //   myChart.setOption({
    //     title: { text: '在Vue中使用echarts' },
    //     tooltip: {},
    //     xAxis: {
    //       data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    //     },
    //     yAxis: {},
    //     series: [
    //       {
    //         name: '销量',
    //         type: 'bar',
    //         data: [5, 20, 36, 10, 10, 20]
    //       }
    //     ]
    //   })
    // }
  }
}
</script>
<style lang="less" scoped>
.fans_item {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px #ccc dashed;
}
</style>
