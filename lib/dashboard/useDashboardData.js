import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function useDashboardData() {

  const [clicks, setClicks] = useState([])
  const [conversions, setConversions] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('dashboard-realtime')

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clicks',
        },
        () => {
          loadData()
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversions',
        },
        () => {
          loadData()
        }
      )

      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns',
        },
        () => {
          loadData()
        }
      )

      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [])

  async function loadData() {

    try {

      setLoading(true)

      // CLICKS
      const {
        data: clicksData,
        error: clicksError
      } = await supabase
        .from('clicks')
        .select('*')
        .order('created_at', {
          ascending: false
        })

      if (clicksError) {
        console.error(clicksError)
      }

      setClicks(clicksData || [])

      // CONVERSIONS
      const {
        data: conversionsData,
        error: conversionsError
      } = await supabase
        .from('conversions')
        .select('*')
        .order('created_at', {
          ascending: false
        })

      if (conversionsError) {
        console.error(conversionsError)
      }

      setConversions(conversionsData || [])

      // CAMPAIGNS
      const {
        data: campaignsData,
        error: campaignsError
      } = await supabase
        .from('campaigns')
        .select('*')

      if (campaignsError) {
        console.error(campaignsError)
      }

      setCampaigns(campaignsData || [])

      setLoading(false)

    } catch (err) {

      console.error(err)

      setLoading(false)

    }

  }

  return {

    clicks,
    conversions,
    campaigns,
    loading,
    loadData

  }

}