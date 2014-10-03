class AdminUser < ActiveRecord::Base
  validates :username, uniqueness: true

  def self.title
    '后台用户管理'
  end
end
