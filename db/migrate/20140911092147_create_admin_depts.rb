class CreateAdminDepts < ActiveRecord::Migration
  def change
    create_table :admin_depts do |t|
      t.string :name, null: true 
      t.integer :is_deleted, default: 0

      t.timestamps
    end
  end
end
