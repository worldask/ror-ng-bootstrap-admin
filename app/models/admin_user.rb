class AdminUser < ActiveRecord::Base
  class << self
    def list
      self.limit(2).offset(0).order(username: :asc)
    end
  end
end
