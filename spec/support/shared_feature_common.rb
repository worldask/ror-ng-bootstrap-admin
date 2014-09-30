# coding: utf-8

# Example:
#
#  # spec/features/admin_xyzs_spec.rb
#  describe AdminXyz
#    context 'search' do
#      it_behaves_like 'shared_feature_common', '/admin/xyzs' do
#        let(:hash_array)               { @xyzs }          # hash array for creating model
#        let(:keyword_part)             { 'part-of-word' } # partial keyword
#        let(:keyword_complete)         { 'whole-word' }   # complete keyword, row count should be 1
#      end
#    end
#  end

shared_examples 'shared_feature_common' do |path|
  let(:hash_array)               { @data }
  let(:keyword_part)             { @keyword_part }
  let(:keyword_complete)         { @row1[@field1.to_sym] }
  let(:add_field)                { [@field1] }
  let(:add_value)                { ["new #{@keyword_part}"] }

  before(:each) do
    described_class.create! hash_array
    visit path
  end

  context 'search' do
    describe 'search <keyword_complete>' do
      it 'row count should be 1' do
        find(:xpath, "//input[@name='q']").set keyword_complete
        find(:xpath, "//a[@ng-click='search(list.keyword);']").click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: 1)
      end
    end

    describe 'search nonexistent row A026C12D-0247-4424-A524-82856876FA48' do
      it 'row count should be 0' do
        find(:xpath, "//input[@name='q']").set 'A026C12D-0247-4424-A524-82856876FA48'
        find(:xpath, "//a[@ng-click='search(list.keyword);']").click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: 0)
      end
    end

    describe 'search <keyword_part>' do
      it 'row count should be <hash_array.length>' do
        find(:xpath, "//input[@name='q']").set keyword_part
        find(:xpath, "//a[@ng-click='search(list.keyword);']").click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: hash_array.length)
      end
    end

    describe 'search empty string' do
      it 'row count should be <hash_array.length>' do
        find(:xpath, "//input[@name='q']").set ''
        find(:xpath, "//a[@ng-click='search(list.keyword);']").click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: hash_array.length)
      end
    end
  end

  context 'cud' do
    describe 'add a row' do
      it 'row count should plus 1' do
        find('a[ng-click="edit({});"]').click
        add_field.each_with_index do |field, i|
          find("input[id=\"#{add_field[i]}\"]").set add_value[i]
        end
        find('a[ng-click="save();"]').click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: @data.length + 1)
      end
    end

    describe 'add several rows' do
      it 'row count should be corresponding' do
        btn_add = find('a[ng-click="edit({});"]')
        @data.each_with_index do |row, i|
          btn_add.click
          add_field.each_with_index do |field, i|
            find("input[id=\"#{add_field[i]}\"]").set row[add_field[i].to_sym] + "copy"
          end
          find('a[ng-click="save();"]').click
          sleep 1
        end

        visit path 
        expect(page).to have_selector('table tbody tr', count: @data.length * 2)
      end
    end

    describe 'edit a row' do
      it "field should be edited" do
        find(:xpath, "//table/tbody/tr/td[text()='#{@row1[@field1.to_sym]}']/../td[@class='text-center']/a[@ng-click='edit(item);']").click
        find("input[id=\"#{@field1.to_sym}\"]").set @row1[@field1.to_sym].reverse
        find('a[ng-click="save();"]').click
        sleep 0.1

        expect(page).to_not have_content @row1[@field1.to_sym]
      end
    end

    describe 'delete a row' do
      it 'row count should minus 1' do
        all('a[ng-click="delConfirm(item);"]').first.click
        find('a[ng-click="del();"]').click
        sleep 0.1
        visit path 
        expect(page).to have_selector('table tbody tr', count: @data.length - 1)
      end
    end 

    describe 'delete a specified row' do
      it "shouldn't exists after deleting" do
        find(:xpath, "//table/tbody/tr/td[text()='#{@row1[@field1.to_sym]}']/../td[@class='text-center']/a[@ng-click='delConfirm(item);']").click
        find('a[ng-click="del();"]').click
        sleep 0.1

        expect(page).to_not have_content @row1[@field1.to_sym]
      end
    end

    #describe 'delete all' do
    #  it 'row count should be 0' do
    #    find(:xpath, "//table/thead/tr//input[@type='checkbox']").click
    #    find('#btnBatchDelete').click
    #    find('a[ng-click="del();"]').click

    #    sleep_until { all('table tbody tr').count <= 0 }
    #    visit path 

    #    expect(page).to have_selector('table tbody tr', count: 0)
    #  end
    #end
  end
end

