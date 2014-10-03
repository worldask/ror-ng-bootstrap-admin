class AdminDept < ActiveRecord::Base
  validates :name, uniqueness: true

  def self.search_fields
    %w(name)
  end

  def self.title
    '后台部门管理'
  end
end
