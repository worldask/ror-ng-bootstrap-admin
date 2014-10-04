# coding: utf-8

# Example:
#
#  # spec/features/admin_xyzs_spec.rb
#  describe AdminXyz
#    context 'search' do
#      it_behaves_like 'shared_feature_list', '/admin/xyzs' do
#      end
#    end
#  end

shared_examples 'shared_feature_list' do |path|
  before(:each) do
    @data = []
    @values = []

    # generate rows
    2.times { |row|
      row_data = {}

      # iterate each fields
      @columns.each_with_index { |value, index|
        row_data[value.to_sym] = "#{@keyword_part} row #{row} field #{index}"
        @values.push("new #{@keyword_part}")

        if (row == 0 and index == 0)
          @keyword_complete = row_data[value.to_sym]
        end
      }

      @data.push(row_data)
    }

    described_class.create! @data
    visit path
  end

  context 'search' do
    describe 'search <@keyword_complete>' do
      it 'row count should be 1' do
        find(:xpath, "//input[@name='q']").set @keyword_complete
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

    describe 'search <@keyword_part>' do
      it 'row count should be <@data.length>' do
        find(:xpath, "//input[@name='q']").set @keyword_part
        find(:xpath, "//a[@ng-click='search(list.keyword);']").click
        sleep 0.1

        expect(page).to have_selector('table tbody tr', count: @data.length)
      end
    end

    #describe 'search empty string' do
    #  it 'row count should be <@data.length>' do
    #    find(:xpath, "//input[@name='q']").set ''
    #    find(:xpath, "//a[@ng-click='search(list.keyword);']").click
    #    sleep 0.1

    #    expect(page).to have_selector('table tbody tr', count: @data.length)
    #  end
    #end
  end

  context 'create' do
    describe 'add a row validating required fields' do
      it 'reqired textbox should be with error style' do
        find('a[ng-click="edit({});"]').click
        find('a[ng-click="save();"]').click
        sleep 0.1

        expect(page).to have_selector('#editForm .has-error')
      end
    end

    describe 'add a row' do
      it 'row count should plus 1' do
        find('a[ng-click="edit({});"]').click
        @columns.each_with_index do |field, i|
          find("input[id=\"#{@columns[i]}\"]").set @values[i]
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
          @columns.each_with_index do |field, i|
            find("input[id=\"#{@columns[i]}\"]").set row[@columns[i].to_sym] + "copy"
          end
          find('a[ng-click="save();"]').click
          sleep 1
        end

        visit path 
        expect(page).to have_selector('table tbody tr', count: @data.length * 2)
      end
    end
  end

  context 'edit' do
    describe 'edit a row' do
      it "field should be edited" do
        find(:xpath, "//table/tbody/tr/td[text()='#{@data[0][@columns[0].to_sym]}']/../td[@class='text-center']/a[@ng-click='edit(item);']").click
        @columns.each { |value|
          find("input[id=\"#{value}\"]").set @data[0][value.to_sym].reverse
        }
        find('a[ng-click="save();"]').click
        sleep 0.1

        # expect(page).to_not have_content @data[0][@columns[0].to_sym]
        expect(page).to have_content @data[0][@columns[0].to_sym].reverse
      end
    end
  end

  context 'delete' do
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
        find(:xpath, "//table/tbody/tr/td[text()='#{@data[0][@columns[0].to_sym]}']/../td[@class='text-center']/a[@ng-click='delConfirm(item);']").click
        find('a[ng-click="del();"]').click
        sleep 0.1

        expect(page).to_not have_content @data[0][@columns[0].to_sym]
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

