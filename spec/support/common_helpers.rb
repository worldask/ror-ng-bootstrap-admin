module CommonHelpers
  def sleep_until(total = 5, step = 0.1, &block)
    remain = total
    while remain >= 0 && !block.call do
      sleep(step)
      printf "\rSleep until: total_seconds: %0.1f, remain_seconds: %0.1f", total, remain
      remain -= step
    end
    printf "\n"
  end
end
