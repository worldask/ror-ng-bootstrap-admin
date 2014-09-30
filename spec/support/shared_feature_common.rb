# coding: utf-8

# Example:
#
#  # spec/features/admin_xyzs_spec.rb
#  describe AdminXyz
#    context 'search' do
#      it_behaves_like 'shared search feature examples', '/admin/xyzs' do
#        let(:hash_array)                 { @xyzs }          # 用于创建 Model 实例的哈希表数组
#        let(:keyword_part)             { 'part-of-word' } # 部分匹配关键字
#        let(:keyword_part_match_count) { n }              # 部分匹配期望值
#        let(:keyword_whole)            { 'whole-word' }   # 全匹配关键字, 期望值固定为1
#      end
#    end
#  end

shared_examples 'shared_feature_common' do |path|
  before(:each) do
    described_class.create! hash_array
    visit path
  end

  context 'search' do
    describe '搜索 <keyword_whole>' do
      it '记录条数应为 1' do
        find(:xpath, "//input[@name='q']").set keyword_whole
        find(:xpath, "//a[@ng-click='search(list.keyword);']").click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: 1)
      end
    end

    describe '搜索不存在的记录 A026C12D-0247-4424-A524-82856876FA48' do
      it '记录条数应为 0' do
        find(:xpath, "//input[@name='q']").set 'A026C12D-0247-4424-A524-82856876FA48'
        find(:xpath, "//a[@ng-click='search(list.keyword);']").click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: 0)
      end
    end

    describe '搜索 <keyword_part>' do
      it '记录条数应为 keyword_part_match_count' do
        find(:xpath, "//input[@name='q']").set keyword_part
        find(:xpath, "//a[@ng-click='search(list.keyword);']").click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: keyword_part_match_count)
      end
    end

    describe '查询空字符串' do
      it '记录数应为 <hash_array.length>' do
        find(:xpath, "//input[@name='q']").set ''
        find(:xpath, "//a[@ng-click='search(list.keyword);']").click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: hash_array.length)
      end
    end
  end

  context 'edit' do
    describe 'add a row' do
      it 'row count should plus 1' do
        find('a[ng-click="edit({});"]').click
        find("input[#{add_field}]").set add_value
        find('a[ng-click="save();"]').click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: @data.length + 1)
      end
    end
  end
end

