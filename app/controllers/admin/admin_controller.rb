class Admin::AdminController < ApplicationController
  def model
    controller_name.classify.constantize
  end

  def index
  end

  def list 
    data = {:title => model.title}
    data[:list] = model.list params

    render json: data
  end

  def create 
    render json: model.create(params)
  end

  def update
    render json: model.update(params)
  end

  def destroy 
    render json: model.destroy(params)
  end

  def bulk_delete
    render json: model.bulk_delete(params)
  end


  layout :choose_layout

  protected
    def choose_layout
      'admin/application'
    end
end
