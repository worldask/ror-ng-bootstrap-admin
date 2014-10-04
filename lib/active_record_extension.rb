module ActiveRecordExtension
  extend ActiveSupport::Concern
  # add your instance methods here

  # add your static(class) methods here
  module ClassMethods
    def list(params)
      data = {}
      page = params[:page] == nil ? 1 : params[:page]
      per_page = Kaminari.config.default_per_page

      if (params[:keyword].nil?) 
        count = self.where(is_deleted: 0).count
        data[:list] = {:data => self.where(is_deleted: 0).order(id: :desc).page(params[:page]).per(per_page)}
      else 
        search_result = resolve_search_fields(self.search_fields, params[:keyword])
        count = self.where(is_deleted: 0).where(search_result[:where], search_result[:params]).count
        data[:list] = {:data => self.where(is_deleted: 0).where(search_result[:where], search_result[:params]).order(id: :desc).page(params[:page]).per(per_page)}
        data[:list][:keyword] = params[:keyword]
      end 

      # paginator
      data[:list][:count] = count
      data[:list][:page] = page
      data[:list][:per_page] = per_page
      data[:list][:last_page] = (count / per_page.to_f).ceil
      #data[:per_page] = Kaminari.config.default_per_page
      #data[:page_count] = (count / Kaminari.config.default_per_page.to_f).ceil

      data[:list]
    end

    def create(params)
      @item = self.new

      params[self.model_name.singular].each {|k, v|
        @item[k] = v
      }
      if (@item.valid?) 
        @item.save
        {code: 1, desc: '保存成功！', id: @item.id}
      else
        code, column, desc = error_reulst(@item.errors)
        {code: code, desc: {column.to_sym => desc}}
      end

      # search_field = this->search_field
      # AdminLog::write(Auth::user()->username, $this->title . '添加' . $this->search_field . '=' . $item->$search_field, Request::getClientIp(), date('Y-m-d H:i:s', time()));
    end

    def update(params)
      @item = self::find(params[:id])

      params[self.model_name.singular].each {|k, v|
        @item[k] = v
      }
      if (@item.valid?) 
        @item.save
        {code: 1, desc: '保存成功！', id: @item.id}
      else
        code, column, desc = error_reulst(@item.errors)
        {code: code, desc: {column.to_sym => desc}}
      end
      # $search_field = $this->search_field;
      # AdminLog::write(Auth::user()->username, $this->title . '编辑' . $this->search_field . '=' . $item->$search_field, Request::getClientIp(), date('Y-m-d H:i:s', time()));
    end

    def destroy(params) 
      @item = self::find(params[:id])
      @item.update(:is_deleted => 1)

      {code: 1, desc: '删除成功！'}
    end

    def bulk_delete(params)
      self.where(:id => params[:ids]).update_all(:is_deleted => 1)

      {code: 1, desc: '删除成功！'}
    end

    private
      def resolve_search_fields(fields, keyword)
        result = {:where => '', :params => {}}

        fields.each{|f|
          result[:where].empty? ? result[:where] += "#{f} like :#{f}" : result[:where] += " or #{f} like :#{f}"
          result[:params][f.to_sym] = "%#{keyword}%"
        }

        result
      end

      def error_reulst(errors)
        errors.messages.each { |key, message|
          case message[0]
          when 'has already been taken'
            return -2, key, '值重复'
          when "can't be blank"
            return -3, key, '不能为空'
          when 'is not a number'
            return -4, key, '必须是数字'
          else
            return -1, key, '未知错误'
          end
        }
      end
  end
end

# include the extension 
ActiveRecord::Base.send(:include, ActiveRecordExtension)
