class CreateCardtables < ActiveRecord::Migration
  def change
    create_table :cardtables do |t|
      t.string :card
      t.integer :x
      t.integer :y
      t.string :deck
      t.string :card_prop
      t.timestamps
    end
  end
end
