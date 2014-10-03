# coding: utf-8
require 'rails_helper'

feature AdminDept, :type => :feature, :js => true do
  before(:all) do
    @keyword_part = 'dept'
    @field1 = 'name'
    @data = [
      @row1 = { @field1.to_sym => "#{@keyword_part} row 1" },
      @row2 = { @field1.to_sym => "#{@keyword_part} row 2" },
    ]
  end

  it_behaves_like 'shared_feature_list', '/admin/depts' do
  end
end
