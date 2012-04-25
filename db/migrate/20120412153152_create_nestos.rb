class CreateNestos < ActiveRecord::Migration
  def change
    create_table :nestos do |t|
      t.column :prva , :string
      t.timestamps
    end
  end
end
