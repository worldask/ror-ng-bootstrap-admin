class Admin::AdminUsersController < Admin::AdminController
  def index
  end

  def list 
    data = {:title => '用户管理'}
    data[:list] = {:data => AdminUser.list}

    render json: data
  end
end
