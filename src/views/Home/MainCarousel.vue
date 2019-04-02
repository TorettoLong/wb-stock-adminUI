<template>
  <div v-loading="listLoading" class="app-container calendar-list-container ">

    <div class="filter-container" style="margin-bottom: 1px;background-color: white; padding: 10px">
      <el-button
        class="filter-item"
        size="small"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >Add
      </el-button>
      <el-button
        v-if="isUpdateSort === true"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-refresh"
        @click="updateSort"
      >update sort
      </el-button>
    </div>

    <el-table :data="navList" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="NO" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="imageUrl">
        <template slot-scope="scope">
          <img :src="scope.row.img_url" style="width: 50%">
        </template>
      </el-table-column>

      <el-table-column align="center" label="link">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="status" width="100" align="center">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status === 1?'success':'danger'"
            size="mini"
            @click="handleUpdateStatus(scope.row)"
          >
            {{ scope.row.status === 1?'Online':'Offline' }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="updateTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.update_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="drag" width="80">
        <template slot-scope="scope">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="operation" class-name="small-padding" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            circle
            @click="handleEdit(scope.row)"
          />

          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            circle
            @click="handleDelete( scope.row)"
          />
        </template>
      </el-table-column>

    </el-table>

    <!-- modal -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
      </el-form>

      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="url" prop="title">
          <el-input v-model="temp.url" />
        </el-form-item>
      </el-form>

      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; height: 200px; margin-left:50px;"
      >
        <el-form-item label="image" prop="title">
          <upload
            :img_url="temp.img_url"
            @uploadSuccess="uploadSuccess"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="createData">Summit</el-button>
        <el-button v-else type="primary" @click="updateData">Summit</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
/**
     * 轮播图
     */
import * as BaseAPI from '../../api/home/carousel'
import upload from '../../components/Upload/Upload'
import moment from 'moment'

import Sortable from 'sortablejs'

export default {
  name: 'MainCarousel',
  components: { upload },
  data() {
    return {
      navList: [],
      pageNum: 1,
      pageSize: 10,
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      temp: {
        id: undefined,
        title: '',
        status: '',
        img_url: ''
      },
      rules: {
        img_url: [{ required: true, message: 'imgUrl is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        url: [{ required: true, message: 'url is required', trigger: 'blur' }]
      },
      olderList: [],
      newList: [],
      sortable: null,
      isUpdateSort: false,
      postData: '',
      dialogVisible: false
    }
  },
  mounted() {
    this.listLoading = true
    this.getCarouselList()
  },
  methods: {
    getCarouselList() {
      this.listLoading = true
      BaseAPI.getList(this.pageNum, this.pageSize).then(res => {
        console.log(res)
        this.listLoading = false
        if (res.code === 200) {
          this.navList = res.data.content
          this.olderList = this.navList.map(v => v.id)
          this.newList = this.olderList.slice()
          this.$nextTick(() => {
            this.setSort()
          })
        }
      }).catch((err) => {
        this.listLoading = false
        console.log(err)
      })
    },
    handleDelete(row) {
      this.$confirm('Danger action, go on delete ?', 'Tip', {
        confirmButtonText: 'sure',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        BaseAPI.del(row.id).then(res => {
          this.listLoading = false
          if (res.code === 200) {
            this.getCarouselList()
            this.$notify({
              title: 'Tip',
              message: 'success',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: 'Tip',
              message: 'fail',
              type: 'fail',
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'cancel success'
        })
      })
    },
    handleUpdateStatus(row) {
      this.listLoading = true
      BaseAPI.updateStatus(row.id).then(res => {
        this.listLoading = false
        if (res.code === 200) {
          this.getCarouselList()
          this.$notify({
            title: 'Tip',
            message: 'update success',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: 'Tip',
            message: 'update fail',
            type: 'fail',
            duration: 2000
          })
        }
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleEdit(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        status: '',
        img_url: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          BaseAPI.addCarousel(this.temp).then(() => {
            this.getCarouselList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Tip',
              message: 'success',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          BaseAPI.updateCarousel(tempData).then(() => {
            this.listLoading = false
            this.getCarouselList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Tip',
              message: 'success',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        onEnd: evt => {
          this.isUpdateSort = true
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    updateSort() {
      console.log(this.newList)
      const ids = Object.assign([], this.newList)
      this.listLoading = true
      BaseAPI.updateSort(ids).then(res => {
        this.listLoading = false
        if (res.code === 200) {
          this.getCarouselList()
          this.isUpdateSort = false
          this.$notify({
            title: 'Tip',
            message: 'success',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    handlePictureCardPreview(file) {
      this.temp.img_url = file.url
      this.dialogVisible = true
    },
    uploadSuccess(fileUrl) {
      console.log('callback ====> ', fileUrl)
      this.temp.img_url = fileUrl
    },
    parseTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }

}
</script>

<style scoped>
    .drag-handler {
        width: 30px;
        height: 30px;
        cursor: pointer;
    }

    .drag-handler .avatar-uploader .el-upload:before {
        border-radius: 6px !important;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 400px;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .calendar-list-container .avatar-uploader-icon {
        width: 330px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
    }

    .calendar-list-container .avatar-uploader-icon:before {
        font-size: 28px;
        color: #8c939d;
        line-height: 200px;
        text-align: center;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

</style>
