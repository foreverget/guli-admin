<template>
  <div class="app-container">
    <!-- 过滤文本框 -->
    <el-input
      v-model="filterText"
      style="margin-bottom:30"
      placeholder="输入关键字进行过滤"/>

    <!-- 树形组件 -->
    <el-tree
      ref="tree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      style="margin-top:10px;" />
  </div>
</template>

<script>
import subjectApi from '@/api/subject'
export default {
  data() {
    return {
      filterText: '',
      subjectList: [], // 数据列表
      defaultProps: {// 属性列表数据属性的key
        children: 'children',
        label: 'title'
      }
    }
  },

  // 监听器
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  created() {
    this.fetchNodeList()
  },
  methods: {
    // 过滤节点
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    fetchNodeList() {
      subjectApi.getNestedTreeList().then(response => {
        this.subjectList = response.data.items
      })
    }
  }
}
</script>
