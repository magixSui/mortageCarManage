<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button> -->
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="showInsertCar"
                >新增</el-button>
                <!-- <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>-->
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
                <el-table-column prop="title" label="名称"></el-table-column>
                <el-table-column prop="price" label="价格"></el-table-column>
                <el-table-column prop="drive" label="驱动"></el-table-column>
                <el-table-column prop="displacement" label="排量"></el-table-column>
                <el-table-column prop="mileage" label="里程"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="date" label="年份"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button> -->
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="提示" :visible.sync="insertCarModal" width="60%" center>
            <el-form :model="form" label-width="70px">
                <el-form-item label="名称">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="年份">
                    <el-date-picker v-model="form.date" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排量">
                    <el-input v-model="form.displacement"></el-input>
                </el-form-item>
                <el-form-item label="驱动">
                    <el-input v-model="form.drive"></el-input>
                </el-form-item>
                <el-form-item label="里程">
                    <el-input v-model="form.mileage"></el-input>
                </el-form-item>
                <el-form-item label="售价">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="车辆照片">
                    <el-upload
                        action="/mortage/upfile"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="(file, fileList)=>handleRemove(file, fileList, i)"
                        :on-success="upSuccess"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <!-- <el-dialog :visible.sync="previewVisible">
                      <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>-->
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="inserCar">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// import { fetchData } from '../../api/index';
import axios from '../../utils/request';
import API from '../../api';

export default {
    name: 'cars',
    data() {
        return {
            query: {
                index: 0,
                count: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {
                images: []
            },
            idx: -1,
            id: -1,
            insertCarModal: false,
            // previewVisible: false,
            // dialogImageUrl: '',
            options: [
                {
                    label: '农民',
                    value: 1
                },
                {
                    label: '学生',
                    value: 2
                },
                {
                    label: '老婆',
                    value: 3
                },
                {
                    label: '改装',
                    value: 4
                },
                {
                    label: '创业',
                    value: 5
                },
                {
                    label: '滴滴',
                    value: 6
                }
            ]
        };
    },
    created() {
        this.getData(this.query);
    },
    methods: {
        showInsertCar() {
            this.insertCarModal = true;
        },
        // 获取 easy-mock 的模拟数据
        getData(data) {
            axios.get(API.car.list,{params: data}).then(res => {
                this.tableData = res.data.cars;
                this.pageTotal = res.data.length;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'index', 0);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                  this.deleteCar({ids: [row._id]}).then(res => {
                    this.$message.success('删除成功');
                    this.getData(this.query);
                  });
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(i) {
            this.$set(this.query, 'index', i - 1);
            this.getData(this.query);
        },
        handlePictureCardPreview(file) {
            // this.dialogImageUrl = file.url;
            // this.previewVisible = true;
        },
        handleRemove(file, list, i) {
            this.form.images.splice(i, 1);
        },
        inserCar() {
            axios.post(API.car.save, this.form).then(res => {
                console.log(res);
            }).finally(() => {
              this.insertCarModal = false;
              this.getData(this.query);
            });
        },
        upSuccess(res, file, fileList) {
            res.data.urls.forEach(item => {
                this.form.images.push(item);
            });
        },
        deleteCar(ids) {
          return axios.post(API.car.delete, ids);
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
