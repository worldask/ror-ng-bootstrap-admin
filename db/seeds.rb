# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
AdminModule.delete_all
sys = AdminModule.create!(:controller => 'javascript:', :method => '', :title =>'系统设置', :parent_id => 0, :level=> 1, :sorting_no => 9999)
AdminModule.create!(:controller => 'modules', :method => '', :title => '菜单管理', :parent_id => sys.id, :level => 2, :sorting_no => 9999)
AdminModule.create!(:controller => 'roles', :method => '', :title => '后台角色管理', :parent_id => sys.id, :level => 2, :sorting_no => 9999)
AdminModule.create!(:controller => 'depts', :method => '', :title => '后台部门管理', :parent_id => sys.id, :level => 2, :sorting_no => 9999)
AdminModule.create!(:controller => 'users', :method => '', :title => '后台员工管理', :parent_id => sys.id, :level => 2, :sorting_no => 9999)
AdminModule.create!(:controller => 'logs', :method => '', :title => '后台操作日志', :parent_id => sys.id, :level => 2, :sorting_no => 9999)

# admin dept seeds
AdminDept.delete_all
AdminDept.create!(:name =>'技术部')
AdminDept.create!(:name =>'运营部')

# admin role seeds
# AdminRole.delete_all
# AdminRole.create!(:name => '超级管理员', :remark => '超级管理员')

# admin user seeds
AdminUser.delete_all
AdminUser.create!(:username => 'admin', :password=> '111')
