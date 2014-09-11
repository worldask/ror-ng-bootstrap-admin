# coding: utf-8
require 'spec_helper'

describe AdminRole, :js => true do
  before(:all) do
    @roles = [
      @admin = { :name => '管理员', :remark => '最高权限' },
      @role1 = { :name => '角色01', :remark => '普通权限' },
      @role2 = { :name => '角色02', :remark => '普通权限' },
      @role3 = { :name => '角色03', :remark => '普通权限' },
    ]
  end

  context '搜索' do
    it_behaves_like 'shared search feature examples', '/admin/roles' do
      let(:hash_ary) { @roles }
      let(:keyword_part) { '普' }
      let(:keyword_part_match_count) { 3 }
      let(:keyword_whole) { @admin[:name] }
    end
  end

  context '编辑' do
    before(:each) do
      AdminRole.create! @roles
      visit admin_roles_path
    end

    describe '添加一个角色' do
      it '记录条数应加1' do
        find('a[title="添加"]').click
        find('input[id="name"]').set '角色04'
        find('input[id="remark"]').set '新增加的角色'
        find('a[title="保存"]').click
        sleep 0.1

        visit admin_roles_path # 刷新页面，确保数据是从后端读取，以下同
        expect(page).to have_selector('table tbody tr', count: @roles.length + 1)
      end
    end

    describe '删除一个角色' do
      it '记录条数应减1' do
        all('a[title="删除"]').first.click
        find('a[ng-click="del();"]').click
        sleep 0.1

        visit admin_roles_path
        expect(page).to have_selector('table tbody tr', count: @roles.length - 1)
      end
    end

    describe '删除指定角色' do
      it '删除之后该角色应不存在' do
        find(:xpath, "//table/tbody/tr/td[text()='#{@admin[:name]}']/../td[@class='text-center']/a[@title='删除']").click
        find('a[ng-click="del();"]').click
        sleep 0.1

        visit admin_roles_path
        expect(page).to_not have_content @admin[:name]
      end
    end

    describe '修改角色' do
      it "角色名称应改变" do
        find(:xpath, "//table/tbody/tr/td[text()='#{@admin[:name]}']/../td[@class='text-center']/a[@title='编辑']").click
        find('input[id="name"]').set @admin[:name].reverse
        find('input[id="remark"]').set @admin[:remark].reverse
        find('a[title="保存"]').click
        sleep 0.1

        visit admin_roles_path
        expect(page).to_not have_content @admin[:name]
      end
    end

    describe '添加多个角色' do
      it '记录条数应相符' do
        btn_add = find('a[title="添加"]')
        @roles.each_with_index do |role, i|
          btn_add.click
          find('input[id="name"]').set(role[:name] + "copy")
          find('input[id="remark"]').set(role[:remark] + "copy")
          find('a[title="保存"]').click
          sleep 1 # 等待页面就绪，暂无更好的解决方法 @gongqj 2014-05-08
        end

        visit admin_roles_path
        expect(page).to have_selector('table tbody tr', count: @roles.length * 2)
      end
    end

    describe '删除所有角色' do
      it '记录条数应为 0' do
        find(:xpath, "//table/thead/tr//input[@type='checkbox']").click
        find('#btnBatchDelete').click
        find('a[ng-click="del();"]').click

        sleep_until { all('table tbody tr').count <= 0 }
        visit admin_roles_path

        expect(page).to have_selector('table tbody tr', count: 0)
      end
    end

    describe '授权更改' do
      it '授权模块数量应相等' do
        module_count = 7
        parent_module = AdminModule.create!(:controller => '', :method => '', :name =>'Parent Module', :parent_id => 0, :level=> 1, :seq_no => 9999, :url => '')
        (2..module_count).step do |n|
          AdminModule.create!(
            :controller => "module_#{n}",
            :method     => 'index',
            :name       => "Module #{n}",
            :parent_id  => parent_module.id,
            :level      => 2,
            :seq_no     => 9999,
            :url        => ''
          )
        end

        visit admin_roles_path # 加载新增的模块数据

        find(:xpath, "//table/tbody/tr/td[text()='#{@admin[:name]}']/../td[@class='text-center']/a[@title='授权']").click
        find(:xpath, "//abn-tree//ul[1]/li[1]//input[@type='checkbox']").click # 全选，模块是树形结构
        find('a[ng-click="updateAuthorize(itemModel);"]').click
        sleep 0.1

        visit admin_roles_path

        find(:xpath, "//table/tbody/tr/td[text()='#{@admin[:name]}']/../td[@class='text-center']/a[@title='授权']").click
        checked_box = all(:xpath, "//abn-tree//ul/li//input[@type='checkbox']").select { |x| x[:checked] == "true" }
        expect(checked_box.count).to eq(module_count)
      end
    end
  end
end
