class Admin::AdminController < ApplicationController
  @@title = ''

  def index
  end

  def list 
    data = {:title => @@title}
    data[:list] = {:data => controller_name.classify.constantize.list}

    render json: data
  end

  def create 
    model = controller_name.classify.constantize
    @model = model.new

    params[model.model_name.singular].each {|k, v|
      @model[k] = v
    }
    @model.save

    render json: {code: 1, desc: 'success', id: @model.id}
    # search_field = this->search_field
    # AdminLog::write(Auth::user()->username, $this->title . '添加' . $this->search_field . '=' . $item->$search_field, Request::getClientIp(), date('Y-m-d H:i:s', time()));
  end

  def update
    model = controller_name.classify.constantize
    @model = model::find(params[:id])

    params[model.model_name.singular].each {|k, v|
      @model[k] = v
    }
    @model.save

    render json: {code: 1, desc: 'success'}
    # $search_field = $this->search_field;
    # AdminLog::write(Auth::user()->username, $this->title . '编辑' . $this->search_field . '=' . $item->$search_field, Request::getClientIp(), date('Y-m-d H:i:s', time()));
  end

  def destroy 
    model = controller_name.classify.constantize
    @model = model::find(params[:id])
    @model.destroy

    render json: {code: 1, desc: 'success'}
  end

  layout :choose_layout

  protected
    def choose_layout
      'admin/application'
    end
end
