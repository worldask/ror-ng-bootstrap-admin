class AdminDept < ActiveRecord::Base
  validates :name, uniqueness: true

  def self.title
    '后台部门管理'
  end
end
