# coding: utf-8
require 'rails_helper'

feature AdminUser, type: :feature, js: true do
  before(:all) do
    @keyword_part = 'user'
    @columns = ['username', 'password']
  end

  it_behaves_like 'shared_feature_list', '/admin/users' do
  end
end
