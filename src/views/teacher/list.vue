<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" >
      <el-form-item>
        <el-autocomplete
          v-model="searchObj.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="讲师名称"
          value-key="name" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师"/>
          <el-option value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getTeacherList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
        <el-button type="danger" @click="batchRemove()">批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" style="width: 100%" border stripe @selection-change="handleSelectionChange">
      <el-table-column type="index" width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80" />
      <el-table-column label="头衔" width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level === 1" type="success" size="mini">高级讲师</el-tag>
          <el-tag v-if="scope.row.level === 2" size="mini">首席讲师</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="简介" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="joinDate" label="入驻时间" width="160" />
      <el-table-column :inline="true" label="操作" width="180">
        <template slot-scope="scope" >
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

      <el-table-column type="selection" />
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="changeCurrent"
      @size-change="changePageSize"
    />

  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
export default {

  // 定义数据模型
  data() {
    return {
      list: [], // 讲师列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 8, // 每页记录数
      searchObj: {}, // 查询条件
      multipleSelection: [], // 批量删除选中的记录列表
      formInline: {
      }
    }
  },

  // 页面渲染成功后获取数据
  created() {
    this.getTeacherList()
  },

  methods: {
    // 姓名左查询
    querySearch(queryString, cb) {
      teacherApi.selectNameListByKey(queryString).then(response => {
        cb(response.data.nameList)
      })
    },

    // 当多选选项发生变化的时候调用
    handleSelectionChange(selection) {
      console.log(selection)
      this.multipleSelection = selection
    },

    // 批量删除
    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历selection,将id取出放入id列表
        var idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return teacherApi.batchRemove(idList)
      }).then((response) => {
        this.getTeacherList()
        this.$message.success(response.message)
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },

    // 清空表单
    resetData() {
      this.searchObj = {}
      this.getTeacherList()
    },

    changePageSize(size) {
      this.limit = size
      this.getTeacherList()
    },

    changeCurrent(page) {
      console.log(page)
      this.page = page
      this.getTeacherList()
    },

    getTeacherList() {
      teacherApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.page.records
        this.total = response.data.page.total
      })
    },

    removeById(id) {
      this.$confirm('此纪录将永久删除，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return teacherApi.deleteById(id)
      }).then((response) => {
        this.getTeacherList()
        this.$message.success(response.message)
      }).catch(error => {
        console.log('error', error)
        // 当取消时会进入catch语句:error = 'cancel'
        // 当后端服务抛出异常时：error = 'error'
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    }

  }
}
</script>
