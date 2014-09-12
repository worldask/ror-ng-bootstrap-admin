class Admin::AdminController < ApplicationController
  @@title = ''

  def index
  end

  def list 
    data = {:title => @@title}
    data[:list] = {:data => controller_name.classify.constantize.list}

    render json: data
  end

  layout :choose_layout

  protected
    def choose_layout
      'admin/application'
    end
end
