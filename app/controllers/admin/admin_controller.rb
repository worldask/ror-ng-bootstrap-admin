class Admin::AdminController < ApplicationController
  layout :choose_layout

  protected
  def choose_layout
    'admin/application'
  end
end
