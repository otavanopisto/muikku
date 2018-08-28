import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import CKEditor from '~/components/general/ckeditor';
import $ from '~/lib/jquery';

interface MemoFieldProps {
  type: string,
  content: {
    example: string,
    columns: string,
    rows: string,
    name: string,
    richedit: boolean
  },
  i18n: i18nType
}

interface MemoFieldState {
  value: string,
  words: number,
  characters: number
}

const ckEditorConfig = {
  autoGrow_onStartup: true,
  mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_HTMLorMML',
  toolbar: [
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
    { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'Undo', 'Redo' ] },
    { name: 'links', items: [ 'Link' ] },
    { name: 'insert', items: [ 'Image', 'Table', 'Muikku-mathjax', 'Smiley', 'SpecialChar' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'styles', items: [ 'Format' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'tools', items: [ 'Maximize' ] }
  ]
}
const extraPlugins = {
  'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.8/',
  'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.8/',
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'autogrow' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/autogrow/4.5.8/plugin.js',
  'muikku-mathjax': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-mathjax/'
}

export default class MemoField extends React.Component<MemoFieldProps, MemoFieldState> {
  constructor(props: MemoFieldProps){
    super(props);
    
    this.state = {
      value: '',
      words: 0,
      characters: 0
    }
    
    this.onInputChange = this.onInputChange.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
  }
  onInputChange(e: React.ChangeEvent<HTMLTextAreaElement>){
    this.setState({
      value: e.target.value,
      words: e.target.value === '' ? 0 : e.target.value.trim().split(/\s+/).length,
      characters: e.target.value === '' ? 0 : e.target.value.trim().replace(/(\s|\r\n|\r|\n)+/g,'').split("").length
    });
  }
  onCKEditorChange(value: string){
    let rawText = $(value).text();
    this.setState({
      value,
      words: rawText === '' ? 0 : rawText.trim().split(/\s+/).length,
      characters: rawText === '' ? 0 : rawText.trim().replace(/(\s|\r\n|\r|\n)+/g,'').split("").length
    });
  }
  render(){
    return <div>
      {!this.props.content.richedit ? <textarea className="muikku-memo-field muikku-field" cols={parseInt(this.props.content.columns)}
        rows={parseInt(this.props.content.rows)} value={this.state.value} onChange={this.onInputChange}/> :
          <CKEditor width="100%" configuration={ckEditorConfig} extraPlugins={extraPlugins}
           onChange={this.onCKEditorChange}>{this.state.value}</CKEditor>}
      <div className="count-container">
        <div className="word-count-container">
          <div className="word-count-title">{this.props.i18n.text.get("plugin.workspace.memoField.wordCount")}</div>
          <div className="word-count">{this.state.words}</div>
        </div>
        <div className="character-count-container">
          <div className="character-count-title">{this.props.i18n.text.get("plugin.workspace.memoField.characterCount")}</div>
          <div className="character-count">{this.state.characters}</div>
        </div>
      </div>
    </div>
  }
}