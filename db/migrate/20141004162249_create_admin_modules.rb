class CreateAdminModules < ActiveRecord::Migration
  def change
    create_table :admin_modules do |t|
      t.string :title
      t.string :controller
      t.string :method, null: true 
      t.integer :parent_id
      t.integer :level
      t.integer :sorting_no, default: 0
      t.integer :is_deleted, default: 0

      t.timestamps
    end
  end
end
