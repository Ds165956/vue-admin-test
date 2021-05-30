<!-- 发布文章模块 -->
<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? '修改文章' : '发布文章'
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="publish-form"
        :model="article"
        label-width="100px"
        :rules="formRules"
      >
        <el-form-item label="标题：" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-tiptap
            lang="zh"
            v-model="article.content"
            :extensions="extensions"
            height="400"
            placeholder="请输入文章内容"
          />
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="article.cover.type" prop="img">
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div v-if="article.cover.type > 0" class="img_temp">
            <upload-cover
              v-for="(cover, index) in article.cover.type"
              :key="index"
              v-model="article.cover.images[index]"
            />
            <!-- <upload-cover
              v-for="(cover, index) in article.cover.type"
              :key="cover"
              :cover-image="article.cover.images[index]"
              @update-cover="onUpdateCover(index, $event)"
            /> -->
          </div>
        </el-form-item>
        <el-form-item label="频道：" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              v-for="(channel, index) in channels"
              :key="index"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{
            $route.query.id ? '修改文章' : '发布文章'
          }}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'element-tiptap/lib/index.css'
import {
  getArticleChannels,
  addArticle,
  getArticle,
  modifyArticle
} from '@/api/article'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Link,
  Image,
  Iframe,
  CodeBlock,
  Blockquote,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  TextAlign,
  Indent,
  LineHeight,
  HorizontalRule,
  HardBreak,
  TrailingNode,
  History,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  FormatClear,
  TextColor,
  TextHighlight,
  Preview,
  Print,
  Fullscreen,
  SelectAll,
  FontType,
  FontSize
} from 'element-tiptap'
import { uploadImages } from '@/api/image'
import UploadCover from './components/upload-cover'
export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    'upload-cover': UploadCover
  },
  props: {},
  data () {
    return {
      channels: [],
      article: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: null
      },
      draft: false,
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Link(),
        new Image({
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImages(fd).then(res => {
              return res.data.data.url
            })
          }
        }),
        new Iframe(),
        new CodeBlock(),
        new Blockquote(),
        new TodoItem(),
        new TodoList(),
        new TextAlign(),
        new Indent(),
        new LineHeight(),
        new HorizontalRule(),
        new HardBreak(),
        new TrailingNode(),
        new History(),
        new Table(),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new FormatClear(),
        new TextColor(),
        new TextHighlight(),
        new Preview(),
        new Print(),
        new Fullscreen(),
        new SelectAll(),
        new FontType(),
        new FontSize()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            }
          }
        ],
        img: [
          { required: true, message: '请选择图片类型', trigger: 'blur' },
          {
            validator (rule, value, callback) {
              console.log(value)
              // if (value === '<p></p>') {
              //   callback(new Error('请输入文章内容'))
              // } else {
              //   callback()
              // }
            }
          }
        ],
        channel_id: [{ required: true, message: '请选择文章频道' }]
      }
    }
  },

  computed: {},

  created () {
    this.loadChannels()

    if (this.$route.query.id) {
      this.loadArticle()
    }
  },

  mounted () {},

  methods: {
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          return
        }
        const articleId = this.$route.query.id
        if (articleId) {
          modifyArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '修改'}成功`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        } else {
          addArticle(this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        }
      })
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    },
    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    }
  }
}
</script>
<style lang="less" scoped>
.img_temp {
  display: flex;
  justify-content: flex-start;
}
</style>
