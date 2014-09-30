# coding: utf-8
require 'rails_helper'

feature AdminDept, :type => :feature, :js => true do
  before(:all) do
    @keyword_part = 'dept'
    @data = [
      @row1 = { :name => "tech #{@keyword_part}" },
      @row2 = { :name => "op #{@keyword_part}" },
    ]
  end

    it_behaves_like 'shared_feature_common', '/admin/depts' do
      # search
      let(:hash_array)               { @data }
      let(:keyword_part)             { @keyword_part }
      let(:keyword_part_match_count) { 2 }
      let(:keyword_whole)            { @row1[:name] }
    end

  context '编辑' do
    before(:each) do
      AdminDept.create! @data
      visit admin_depts_path
      sleep 0.1
    end

    describe '添加一个部门' do
      it '记录条数应加1' do
        find('a[title="添加"]').click
        find('input[id="name"]').set '新部门'
        find('a[title="保存"]').click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: @data.length + 1)
      end
    end

    describe '删除一个部门' do
      it '记录条数应减1' do
        all('a[title="删除"]').first.click
        find('a[ng-click="del();"]').click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: @data.length - 1)
      end
    end

    describe '删除指定部门' do
      it '删除之后该部门应不存在' do
        find(:xpath, "//table/tbody/tr/td[text()='#{@row1[:name]}']/../td[@class='text-center']/a[@title='删除']").click
        find('a[ng-click="del();"]').click
        sleep 0.1

        expect(page).to_not have_content @row1[:name]
      end
    end

    describe '修改部门' do
      it "部门名称应改变" do
        find(:xpath, "//table/tbody/tr/td[text()='#{@row1[:name]}']/../td[@class='text-center']/a[@title='编辑']").click
        find('input[id="name"]').set @row1[:name].reverse
        find('a[title="保存"]').click
        sleep 0.1

        expect(page).to_not have_content @row1[:name]
      end
    end

    describe '添加多个部门' do
      it '记录条数应相符' do
        btn_add = find('a[title="添加"]')
        @data.each_with_index do |dept, i|
          btn_add.click
          find('input[id="name"]').set(dept[:name] + "copy")
          find('a[title="保存"]').click
          sleep 1
        end

        visit admin_depts_path
        expect(page).to have_selector('table tbody tr', count: @data.length * 2)
      end
    end

    #describe '删除所有部门' do
    #  it '记录条数应为 0' do
    #    find(:xpath, "//table/thead/tr//input[@type='checkbox']").click
    #    find('#btnBatchDelete').click
    #    find('a[ng-click="del();"]').click

    #    sleep_until { all('table tbody tr').count <= 0 }
    #    visit admin_depts_path

    #    expect(page).to have_selector('table tbody tr', count: 0)
    #  end
    #end
  end
end
