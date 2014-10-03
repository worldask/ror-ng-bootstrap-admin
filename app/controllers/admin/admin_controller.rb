class Admin::AdminController < ApplicationController
  def model
    controller_name.classify.constantize
  end

  def index
  end

  def list 
    data = {:title => model.title}
    page = params[:page] == nil ? 1 : params[:page]

    if (params[:keyword].nil?) 
      count = model.where(is_deleted: 0).count
      data[:list] = {:data => model.where(is_deleted: 0).order(id: :desc).page(params[:page]).per(4)}
    else 
      count = model.where(is_deleted: 0).where("name like ?", '%' +  params[:keyword] + '%').count
      data[:list] = {:data => model.where(is_deleted: 0).where("name like ?", "%#{params[:keyword]}%").order(id: :desc).page(params[:page]).per(4)}
      data[:list][:keyword] = params[:keyword]
    end 

    # paginator
    data[:list][:count] = count
    data[:list][:page] = page
    data[:list][:per_page] = 4
    data[:list][:last_page] = (count / 4.to_f).ceil
    #data[:per_page] = Kaminari.config.default_per_page
    #data[:page_count] = (count / Kaminari.config.default_per_page.to_f).ceil

    render json: data
  end

  def create 
    @model = model.new

    params[model.model_name.singular].each {|k, v|
      @model[k] = v
    }
    if (@model.valid?) 
      @model.save
      result = {code: 1, desc: '保存成功！', id: @model.id}
    else
      result = {code: -1, desc: @model.errors.messages}
    end

    render json: result
    # search_field = this->search_field
    # AdminLog::write(Auth::user()->username, $this->title . '添加' . $this->search_field . '=' . $item->$search_field, Request::getClientIp(), date('Y-m-d H:i:s', time()));
  end

  def update
    @model = model::find(params[:id])

    params[model.model_name.singular].each {|k, v|
      @model[k] = v
    }
    if (@model.valid?) 
      @model.save
      result = {code: 1, desc: '保存成功！', id: @model.id}
    else
      result = {code: -1, desc: @model.errors.messages}
    end

    render json: result
    # $search_field = $this->search_field;
    # AdminLog::write(Auth::user()->username, $this->title . '编辑' . $this->search_field . '=' . $item->$search_field, Request::getClientIp(), date('Y-m-d H:i:s', time()));
  end

  def destroy 
    @model = model::find(params[:id])
    @model.update(:is_deleted => 1)

    render json: {code: 1, desc: '删除成功！'}
  end

  def bulk_delete
    model.where(:id => params[:ids]).update_all(:is_deleted => 1)

    render json: {code: 1, desc: '删除成功！'}
  end
  

  layout :choose_layout

  protected
    def choose_layout
      'admin/application'
    end
end
