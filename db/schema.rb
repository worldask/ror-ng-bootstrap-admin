# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141016165709) do

  create_table "admin_depts", force: true do |t|
    t.string   "name"
    t.integer  "is_deleted", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "admin_modules", force: true do |t|
    t.string   "title"
    t.string   "controller"
    t.string   "method"
    t.integer  "parent_id"
    t.integer  "level"
    t.integer  "sorting_no", default: 0
    t.integer  "is_deleted", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "admin_users", force: true do |t|
    t.string   "username"
    t.string   "password"
    t.string   "name"
    t.integer  "dept_id"
    t.integer  "is_deleted", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "avatar"
  end

end
