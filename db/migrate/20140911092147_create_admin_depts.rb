class CreateAdminDepts < ActiveRecord::Migration
  def change
    create_table :admin_depts do |t|

      t.timestamps
    end
  end
end
