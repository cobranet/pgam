# Class that define table
#  create_table "cardtables", :force => true do |t|
#    t.string   "card"
#    t.integer  "x"
#    t.integer  "y"
#    t.string   "deck"
#    t.string   "card_prop"
#    t.datetime "created_at"
#    t.datetime "updated_at"
#  end
class Cardtable < ActiveRecord::Base
  # only one card
  def self.test1
    a = Cardtable.new
    a.card = "AH"
    a.x = 100
    a.y = 100
    a
  end  
end
