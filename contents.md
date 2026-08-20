/grill-with-docs 开发实现/admin/contents功能

内容管理

# 前端界面

采用react-resizable-panels构建左右布局

## 左侧：

默认宽度300,参考AI助手面板，collapsible minSize={100}

顶部工具栏： 标题区（显示所有内容）+右侧图标按钮

下方是内容树：

基于@headless-tree/react构建支持拖拽的树。

树的数据来源是/api/contents/nav,基于flextree-rest提供的API来实现树的遍历，CRUD,move,复制。

内容树支持在节点上弹出上下文弹出菜单，支持树的各种操作，如向上移动，删除，编辑等。

工具和内容树占据所有垂直空间。

## 右侧

一个tabs界面，包括页签：内容、属性、文件
占据所有垂直空间。

- 内容

占据垂直空间的react-markdown组件，用于编辑contents表的content内容

- 属性

提供编辑contents表的其他字段，包括name,title,description,source,stars,type,tags,url,keywords,video(url链接，支持多个)

- 文件

包括顶部工具栏
下方是占据所有垂直空间的文件的列表视图，支持列表和卡片两种视图
列表视图支持显示图片大小
卡片视图能预览图片

支持删除，上传、重命名
支持选中多个删除

媒体文件如果是图片保存在images中，只保存相对public的相对路径
其他文件保存在files中

默认上传路径为
文件上传到 contents/<contentId>/files
图片文件上传到 contents/<contentId>/images

要支持直接拖动文件到视图就自动上传

# 后端API

- 文件上传已经现有/api/upload实现了，可以直接使用，在上传文 件时需要附带contentId
  文件上传到public/upload/contents/<contentId>

树的数据来源是/api/contents/tree
/api/contents/tree采用 flextree-rest提供API，实现访问contents的功能
contents是基于flextree实现

/api/contents/部署对contents的CRUD功能 API

API要支持next-rest-framework实现

文件上传使用 uppy,集成方式参考https://uppy.io/docs/nextjs/

在src\modules\contens/index.ts创建一个叫ContentManager的管理器，负责提供内容管理

class ContentManager extends EventEmitter{
tree---> src\db\models\SiteContents.ts得到的树管理器
}

所有与内容管理相关的后台功能，
ContentManager是全局单例，在应用启动时运行
然后会监听uploadServer的'upload'在监听到与内容相关的文件上传时，检查contentId，然后将上传的文件相对路径更新到数据表contents中的files或images中
