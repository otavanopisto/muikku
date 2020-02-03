//NOTE this is a sandbox file, because the code in the material loader is so complex I created this self contained
//blackbox environment that makes it so that the material loader behaves like one component, this is bad because
//it does not have the same capabilities and efficiency as the other components, and cannot be easily modified
//please remove it

import * as React from 'react';

//TODO add the scss files that are necessary to render this material page correctly...
//this file is temporary use it to dump the content from the deprecated scss files that are necessary
import "~/sass/elements/__ugly-material-loader-deprecated-file-mashup.scss";
import { MaterialType } from '~/reducers/main-function/records';
import '~/sass/elements/rich-text.scss';
import $ from '~/lib/jquery';
import mApi from '~/lib/mApi';
import { WorkspaceType } from '~/reducers/workspaces';
import promisify from '~/util/promisify';




//Bubble gum scripting needs
$.getScript("//cdnjs.cloudflare.com/ajax/libs/jquery_lazyload/1.9.5/jquery.lazyload.min.js");
$.getScript("//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.0.1/jquery.magnific-popup.min.js");
$.getScript("//cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.7/jquery.fileupload.min.js");
$.getScript("//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_HTMLorMML");
$.getScript("//cdn.muikkuverkko.fi/libs/dustjs-linkedin/2.7.1/dust-full.min.js", function(){
  $.getScript("//cdn.muikkuverkko.fi/libs/dustjs-helpers/1.7.1/dust-helpers.min.js", function(){
    var mdust:any = {};

  mdust.loading = {};
  mdust.queued = {};

  (window as any).dust.onLoad = function(name: any, callback: any) {
    if (mdust.loading[name]) {
      if (!mdust.queued[name]) {
        mdust.queued[name] = [];
      }
      
      mdust.queued[name].push(callback);
    } else {
      mdust.loading[name] = true;
      
      $.ajax((window as any).CONTEXTPATH + '/resources/dust/' + name, {
        //Fixes Firefox complains about XML #3330
        mimeType: "text/plain",
        
        success : function(data: any, textStatus: any, jqXHR: any) {
          delete mdust.loading[name];
          callback(false, data);
          
          if (mdust.queued[name]) {
            $.each(mdust.queued[name], function (ind: any, queuedCallback: any) {
              queuedCallback(false, data);
            });
            
            delete mdust.queued[name];
          }
        },
        error: function (jqXHR: any, textStatus: any, errorThrown: any) {
          var message = 'Could not find Dust template: ' + name;
          
          //WELP this should never happen
          $('.notification-queue').notificationQueue('notification', 'error', message);  
        }
      })
    };
  };

  (window as any).dust.filters.formatDate = function(value: any) {
    return (window as any).formatDate((window as any).moment(value).toDate());
  };

  (window as any).dust.filters.formatTime = function(value: any) {
    return (window as any).formatTime((window as any).moment(value).toDate());
  };

  (window as any).dust.filters.formatPercent = function(value: any) {
    return parseFloat(value).toFixed(2);
  };

  (window as any).dust.filters.shorten50 = function (value) {
    if (value.length < 50) {
      return value;
    } else {
      return value.slice(0, 47) + "...";
    }
  }

  (window as any).dust.helpers.contextPath = function(chunk: any, context: any, bodies: any) {
    return chunk.write((window as any).CONTEXTPATH);
  };

  (window as any).renderDustTemplate = function(templateName: any, json: any, callback: any) {
    var base = (window as any).dust.makeBase({
      localize: function(chunk: any, context: any, bodies: any, params: any) {
        var args = new Array();
        var i = 0;
        while (true) {
          if (params["arg" + i] != null) {
            args.push(params["arg" + i]);
          } else {
            break;
          }
          
          i++;
        }
        
        var text = (window as any).getLocaleText(params.key, args);
        if (text)
          text = text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        
        var result = chunk.write(text);
        return result;
      },
      isLoggedIn: function(chunk: any, context: any, bodies: any, params: any) {
        if ((window as any).MUIKKU_LOGGEDIN === true) {
          return chunk.render(bodies.block, context);
        } else {
          if (bodies['else']) {
            return chunk.render(bodies['else'], context);
          }
        }
      }
    });
    
    (window as any).dust.render(templateName, base.push(json), function (err: any, text: any) {
      if (err) {
        var message = "Error occured while rendering dust template " + templateName + ": " + err;
        $('.notification-queue').notificationQueue('notification', 'error', message);  
      } else {
        callback(text);
      }
    });
  };
  })
});

interface MaterialLoaderProps {
  material: MaterialType,
  workspace: WorkspaceType
}

interface MaterialLoaderState {
}

let materialRepliesCache:{[key: string]: any} = {};

export default class MaterialLoader extends React.Component<MaterialLoaderProps, MaterialLoaderState> {
  constructor(props: MaterialLoaderProps){
    super(props);
    
    this.stopPropagation = this.stopPropagation.bind(this);
  }
  componentDidMount(){
    this.create();
  }
  stopPropagation(e: React.MouseEvent<HTMLDivElement>){
    e.stopPropagation();
  }
  async create(){
    let fieldAnswers:any = materialRepliesCache[this.props.workspace.id + "-" + this.props.material.assignment.id];
    if (!fieldAnswers){
      fieldAnswers = {};
      let replies:any = await promisify(mApi().workspace.workspaces.materials.compositeMaterialReplies
          .read(this.props.workspace.id, this.props.material.assignment.id, {userEntityId: (window as any).MUIKKU_LOGGED_USER_ID}), 'callback')();
      replies = replies.answers ? replies : {answers: []};
      for (let i = 0, l = replies.answers.length; i < l; i++) {
        let answer = replies.answers[i];
        let answerKey = [answer.materialId, answer.embedId, answer.fieldName].join('.');
        fieldAnswers[answerKey] = answer.value;
      }
      
      materialRepliesCache[this.props.workspace.id + "-" + this.props.material.assignment.id] = fieldAnswers;
    }
    
    //I can't start explaining how wrong this is
    //get data from the sever, put in in a variable, parse the variable, create a virtual element so that the material loader can
    //Read it from what it believes is the dom
    $('<div/>').attr("data-grades", JSON.stringify((window as any).GRADES))
      .muikkuMaterialLoader({
        readOnlyFields: true,
        fieldlessMode: true,
        baseUrl: "/workspace/" + this.props.workspace.urlName + "/materials"
      }).muikkuMaterialLoader('loadMaterial', this.refs.sandbox, fieldAnswers);
  }
  render(){
    return <div className="__deprecated">
      {this.props.material.evaluation && this.props.material.evaluation.verbalAssessment ?
          <div className="tr-task-content content lg-flex-cell-full md-flex-cell-full sm-flex-cell-full">
            <div className="application-sub-panel__text application-sub-panel__text--task-evaluation rich-text" dangerouslySetInnerHTML={{__html: this.props.material.evaluation.verbalAssessment}}></div>
          </div>
       : null}
      <div ref="sandbox" className="tr-task-material material lg-flex-cell-full md-flex-cell-full sm-flex-cell-full"
      data-material-id={this.props.material.id} data-workspace-material-id={this.props.material.assignment.id}
      data-material-content={this.props.material.html} data-path={this.props.material.assignment.path} data-material-type="html"
      data-loaded="false" data-workspace-entity-id={this.props.workspace.id} onClick={this.stopPropagation}/>
    </div>
  }
}