class Admin::AdminController < ApplicationController
  @@title = ''

  def index
  end

  def list 
    model = controller_name.classify.constantize
    page = params[:page] == nil ? 1 : params[:page]

    data = {:title => @@title}
    data[:list] = {:data => model.page(params[:page]).per(4)}

    # pagination
    count = model.count
    data[:list][:count] = count
    data[:list][:page] = page
    data[:list][:per_page] = 4
    data[:list][:last_page] = (count / 4.to_f).ceil
    #data[:per_page] = Kaminari.config.default_per_page
    #data[:page_count] = (count / Kaminari.config.default_per_page.to_f).ceil

    render json: data
  end

  def create 
    model = controller_name.classify.constantize
    @model = model.new

    params[model.model_name.singular].each {|k, v|
      @model[k] = v
    }
    @model.save

    render json: {code: 1, desc: '保存成功！', id: @model.id}
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

    render json: {code: 1, desc: '保存成功！'}
    # $search_field = $this->search_field;
    # AdminLog::write(Auth::user()->username, $this->title . '编辑' . $this->search_field . '=' . $item->$search_field, Request::getClientIp(), date('Y-m-d H:i:s', time()));
  end

  def destroy 
    model = controller_name.classify.constantize
    @model = model::find(params[:id])
    @model.destroy

    render json: {code: 1, desc: '删除成功！'}
  end

  layout :choose_layout

  protected
    def choose_layout
      'admin/application'
    end
end
