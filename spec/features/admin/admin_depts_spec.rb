# coding: utf-8
require 'rails_helper'

feature AdminDept, :type => :feature, :js => true do
  before(:all) do
    @keyword_part = 'user'
    @columns = ['name']
  end

  it_behaves_like 'shared_feature_list', '/admin/depts' do
  end
end
