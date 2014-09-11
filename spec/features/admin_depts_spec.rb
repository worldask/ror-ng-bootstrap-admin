# coding: utf-8
require 'spec_helper'

describe AdminDept, :js => true do
  before(:all) do
    @depts = [
      @tech = { :name => '技术部', :remark => 'Technical Dept' },
      @oper = { :name => '运营部', :remark => 'Operation Dept' },
    ]
  end

  context '搜索' do
    it_behaves_like 'shared search feature examples', '/admin/depts' do
      let(:hash_ary)                 { @depts }
      let(:keyword_part)             { '部' }
      let(:keyword_part_match_count) { 2 }
      let(:keyword_whole)            { '技术部' }
    end
  end

  context '编辑' do
    before(:each) do
      AdminDept.create! @depts
      visit admin_depts_path
      sleep 0.1
    end

    describe '添加一个部门' do
      it '记录条数应加1' do
        find('a[title="添加"]').click
        find('input[id="name"]').set '新部门'
        find('input[id="remark"]').set 'New Dept'
        find('a[title="保存"]').click
        sleep 0.1

        visit admin_depts_path # 刷新页面，确保数据是从后端读取，以下同
        expect(page).to have_selector('table tbody tr', count: @depts.length + 1)
      end
    end

    describe '删除一个部门' do
      it '记录条数应减1' do
        all('a[title="删除"]').first.click
        find('a[ng-click="del();"]').click
        sleep 0.1

        visit admin_depts_path
        expect(page).to have_selector('table tbody tr', count: @depts.length - 1)
      end
    end

    
    describe '删除指定部门' do
      it '删除之后该部门应不存在' do
        find(:xpath, "//table/tbody/tr/td[text()='#{@tech[:name]}']/../td[@class='text-center']/a[@title='删除']").click
        find('a[ng-click="del();"]').click
        sleep 0.1

        visit admin_depts_path
        expect(page).to_not have_content @tech[:name]
      end
    end

    describe '修改部门' do
      it "部门名称应改变" do
        find(:xpath, "//table/tbody/tr/td[text()='#{@tech[:name]}']/../td[@class='text-center']/a[@title='编辑']").click
        find('input[id="name"]').set @tech[:name].reverse
        find('input[id="remark"]').set @tech[:remark].reverse
        find('a[title="保存"]').click
        sleep 0.1

        visit admin_depts_path
        expect(page).to_not have_content @tech[:name]
      end
    end

    describe '添加多个部门' do
      it '记录条数应相符' do
        btn_add = find('a[title="添加"]')
        @depts.each_with_index do |dept, i|
          btn_add.click
          find('input[id="name"]').set(dept[:name] + "copy")
          find('input[id="remark"]').set(dept[:remark] + "copy")
          find('a[title="保存"]').click
          sleep 1 # 等待页面就绪，暂无更好的解决方法 @gongqj 2014-05-08
        end

        visit admin_depts_path
        expect(page).to have_selector('table tbody tr', count: @depts.length * 2)
      end
    end

    describe '删除所有部门' do
      it '记录条数应为 0' do
        find(:xpath, "//table/thead/tr//input[@type='checkbox']").click
        find('#btnBatchDelete').click
        find('a[ng-click="del();"]').click

        sleep_until { all('table tbody tr').count <= 0 }
        visit admin_depts_path

        expect(page).to have_selector('table tbody tr', count: 0)
      end
    end
  end
end
