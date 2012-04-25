class CardtablesController < ApplicationController
  def show
    
    @colors = ["C","H","S","D"]
    @values = ["7","8","9","T","J","Q","K","A"]
    @ct  = Cardtable.test1
    respond_to  do |format|
      format.html
      format.json { render :json => @ct.to_json }
    end 
  end
  def new 
    @ct = Cardtable.new
  end
end
