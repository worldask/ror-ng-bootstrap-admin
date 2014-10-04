class CreateAdminModules < ActiveRecord::Migration
  def change
    create_table :admin_modules do |t|

      t.timestamps
    end
  end
end
