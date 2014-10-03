class AdminUser < ActiveRecord::Base
  validates :username, uniqueness: true

  def self.search_fields
    %w(username)
  end

  def self.title
    '后台用户管理'
  end
end
