(window.webpackJsonp=window.webpackJsonp||[]).push([[59],{464:function(n,e,l){"use strict";l.r(e);var t=l(3),a=l.n(t),o=l(4),c=l.n(o),r=l(2),s=l.n(r),i=l(5),h=l.n(i),d=function(n){function e(){var n,t,o,r;c()(this,e);for(var i=arguments.length,h=Array(i),d=0;d<i;d++)h[d]=arguments[d];return t=o=s()(this,(n=e.__proto__||a()(e)).call.apply(n,[this].concat(h))),o.document=function(){return{document:l(514),className:"locale-provider-page"}},r=t,s()(o,r)}return h()(e,n),e}(l(490).a);e.default=d},514:function(n,e){n.exports="# 国际化 LocaleProvider\n\n\n\n## 基本用法\n```jsx\nimport { Cell, LocaleProvider, Button, SearchBar, Confirm, Select } from 'zarm';\n\nconst locales = {\n  en: {\n    locale: 'en',\n    Confirm: {\n      cancelText: 'Cancel',\n      okText: 'Ok',\n    },\n    SearchBar: {\n      placeholder: 'Search',\n      cancelText: 'Cancel',\n    },\n  },\n  'zh-cn': {\n    locale: 'zh_cn',\n    Confirm: {\n      cancelText: '取消',\n      okText: '确定',\n    },\n    SearchBar: {\n      placeholder: '搜索',\n      cancelText: '取消',\n    },\n  },\n};\n\nclass Demo extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      visible: false,\n      locale: 'en',\n    };\n    this.onOk = this.onOk.bind(this);\n  }\n\n  onOk(selected) {\n    this.setState({\n      locale: selected[0].value,\n    });\n  }\n\n  toggle() {\n    this.setState({\n      visible: !this.state.visible\n    });\n  }\n\n  render() {\n    return (\n      <LocaleProvider locale={locales[this.state.locale]}>\n        <div>\n          <Cell title=\"语种\">\n            <Select\n              value={this.state.locale}\n              dataSource={[\n                { value: 'en', label: 'English' },\n                { value: 'zh-cn', label: '中文' },\n              ]}\n              onOk={this.onOk}\n            />\n          </Cell>\n          <SearchBar />\n        </div>\n      </LocaleProvider>\n    )\n  }\n}\n\nReactDOM.render(<Demo />, mountNode);\n```\n\n\n\n## API\n\n| 属性 | 类型 | 默认值 | 说明 |\n| :--- | :--- | :--- | :--- |\n| locale | Object | - | 语言包配置，语言包可到 zarm/lib/locale-provider/locale 目录下寻找 |\n"}}]);