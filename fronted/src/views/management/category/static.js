export const DIALOG_TITLE = {
  ADD: '新增分类',
  EDIT: '编辑分类',
}

export const FORM_RULES = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  order: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
}

export const COLUMNS = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '分类名称', minWidth: 150 },
  { prop: 'articleCount', label: '文章数量', width: 100 },
  { prop: 'order', label: '排序', width: 100 },
  { slotName: 'action', width: 200, fixed: 'right' },
]
