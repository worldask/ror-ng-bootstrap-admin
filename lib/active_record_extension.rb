module ActiveRecordExtension
  extend ActiveSupport::Concern
  # add your instance methods here

  # add your static(class) methods here
  module ClassMethods
    def list
      order_by = 'id'
      order_seq = 'desc'

      self.limit(10).offset(0).order(order_by => order_seq.to_sym)
    end
  end
end

# include the extension 
ActiveRecord::Base.send(:include, ActiveRecordExtension)
