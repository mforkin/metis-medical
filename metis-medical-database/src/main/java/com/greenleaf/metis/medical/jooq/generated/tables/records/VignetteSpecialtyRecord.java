/*
 * This file is generated by jOOQ.
 */
package com.greenleaf.metis.medical.jooq.generated.tables.records;


import com.greenleaf.metis.medical.jooq.generated.tables.VignetteSpecialty;

import javax.annotation.Generated;

import org.jooq.Field;
import org.jooq.Record2;
import org.jooq.Row2;
import org.jooq.impl.UpdatableRecordImpl;


/**
 * This class is generated by jOOQ.
 */
@Generated(
    value = {
        "http://www.jooq.org",
        "jOOQ version:3.11.5"
    },
    comments = "This class is generated by jOOQ"
)
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class VignetteSpecialtyRecord extends UpdatableRecordImpl<VignetteSpecialtyRecord> implements Record2<Integer, Integer> {

    private static final long serialVersionUID = -525646718;

    /**
     * Setter for <code>public.vignette_specialty.vignette_id</code>.
     */
    public void setVignetteId(Integer value) {
        set(0, value);
    }

    /**
     * Getter for <code>public.vignette_specialty.vignette_id</code>.
     */
    public Integer getVignetteId() {
        return (Integer) get(0);
    }

    /**
     * Setter for <code>public.vignette_specialty.specialty_id</code>.
     */
    public void setSpecialtyId(Integer value) {
        set(1, value);
    }

    /**
     * Getter for <code>public.vignette_specialty.specialty_id</code>.
     */
    public Integer getSpecialtyId() {
        return (Integer) get(1);
    }

    // -------------------------------------------------------------------------
    // Primary key information
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Record2<Integer, Integer> key() {
        return (Record2) super.key();
    }

    // -------------------------------------------------------------------------
    // Record2 type implementation
    // -------------------------------------------------------------------------

    /**
     * {@inheritDoc}
     */
    @Override
    public Row2<Integer, Integer> fieldsRow() {
        return (Row2) super.fieldsRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Row2<Integer, Integer> valuesRow() {
        return (Row2) super.valuesRow();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field1() {
        return VignetteSpecialty.VIGNETTE_SPECIALTY.VIGNETTE_ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Field<Integer> field2() {
        return VignetteSpecialty.VIGNETTE_SPECIALTY.SPECIALTY_ID;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer component1() {
        return getVignetteId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer component2() {
        return getSpecialtyId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value1() {
        return getVignetteId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Integer value2() {
        return getSpecialtyId();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public VignetteSpecialtyRecord value1(Integer value) {
        setVignetteId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public VignetteSpecialtyRecord value2(Integer value) {
        setSpecialtyId(value);
        return this;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public VignetteSpecialtyRecord values(Integer value1, Integer value2) {
        value1(value1);
        value2(value2);
        return this;
    }

    // -------------------------------------------------------------------------
    // Constructors
    // -------------------------------------------------------------------------

    /**
     * Create a detached VignetteSpecialtyRecord
     */
    public VignetteSpecialtyRecord() {
        super(VignetteSpecialty.VIGNETTE_SPECIALTY);
    }

    /**
     * Create a detached, initialised VignetteSpecialtyRecord
     */
    public VignetteSpecialtyRecord(Integer vignetteId, Integer specialtyId) {
        super(VignetteSpecialty.VIGNETTE_SPECIALTY);

        set(0, vignetteId);
        set(1, specialtyId);
    }
}
