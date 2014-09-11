# coding: utf-8
require 'spec_helper'

describe 'AdminSigns', :js => true do
  before(:all) do
    @user = {
      :username => 'admin',
			:password=> 'admin'
    }
  end

  describe '模拟用户操作' do
    context '登录' do
      it '用户名为空' do
        visit admin_signin_path

        find('#btnLogin').click

        # expect what
      end

      it '密码为空' do
        visit admin_signin_path
        find('input[id="username"]').set @user[:username]
        find('#btnLogin').click

        # expect what
      end
			
      it '登录成功' do
        visit admin_signin_path
        find('input[id="username"]').set @user[:username]
        find('input[id="password"]').set @user[:username]
        find('#btnLogin').click

        # expect what
      end
    end
  end
end
