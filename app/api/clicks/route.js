import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

// GET - pobierz aktualną liczbę kliknięć
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('counters')
      .select('*');

    console.log('GET response:', { data, error });

    if (error) {
      console.error('Supabase GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Jeśli nie ma żadnych rekordów, utwórz pierwszy
    if (!data || data.length === 0) {
      console.log('No records found, creating initial record');
      const { data: newCounter, error: insertError } = await supabase
        .from('counters')
        .insert([{ id: 'global_counter', clicks: 0 }])
        .select()
        .single();

      if (insertError) {
        console.error('Supabase INSERT error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ clicks: 0 });
    }

    return NextResponse.json({ clicks: data[0].clicks });
  } catch (error) {
    console.error('Unexpected error in GET:', error);
    return NextResponse.json({ error: 'Unexpected server error in GET' }, { status: 500 });
  }
}

// POST - zwiększ licznik kliknięć
export async function POST() {
  try {
    // Najpierw sprawdźmy czy rekord istnieje
    const { data: checkData, error: checkError } = await supabase
      .from('counters')
      .select('clicks')
      .eq('id', 'global_counter')
      .single();

    console.log('Check existing record:', { checkData, checkError });

    if (checkError) {
      console.error('Error checking record:', checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    // Aktualizuj licznik
    const { data: updateData, error: updateError } = await supabase
      .from('counters')
      .update({ clicks: (checkData.clicks || 0) + 1 })
      .eq('id', 'global_counter')
      .select()
      .single();

    console.log('Update response:', { updateData, updateError });

    if (updateError) {
      console.error('Supabase UPDATE error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (!updateData) {
      console.error('No data returned from update');
      return NextResponse.json({ error: 'Update failed - no data returned' }, { status: 500 });
    }

    return NextResponse.json({ clicks: updateData.clicks });
  } catch (error) {
    console.error('Unexpected error in POST:', error);
    return NextResponse.json({ 
      error: `Unexpected server error in POST: ${error.message || 'Unknown error'}`
    }, { status: 500 });
  }
} 