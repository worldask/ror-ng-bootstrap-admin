class AdminModule < ActiveRecord::Base
  validates :title, uniqueness: true
  validates :title, :controller, :parent_id, presence: true
  validates :parent_id, :level, :sorting_no, numericality: { only_integer: true }

  def self.title
    'title'
  end

  def self.search_fields
    %w(title controller method)
  end
end
