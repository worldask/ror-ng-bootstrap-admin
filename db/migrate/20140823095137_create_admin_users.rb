class CreateAdminUsers < ActiveRecord::Migration
  def change
    create_table :admin_users do |t|
      t.string :username
      t.string :password
      t.string :name, null: true 
      t.integer :dept_id
      t.integer :is_deleted, default: 0

      t.timestamps
    end
  end
end
